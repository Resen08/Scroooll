import { createInitialState, accumulateVirtualDistance } from "./state/app-state";
import { SectionPool } from "./engine/section-pool";
import { ScrollEngine } from "./engine/scroll-engine";
import { StatsPanel } from "./ui/stats-panel";
import { loadSnapshot, saveSnapshot } from "./state/persistence";

const INITIAL_SECTIONS = 20;
const APPEND_BATCH = 4;
const RESTORE_BATCH = 12;
const RESTORE_MAX_STEPS = 4000;

function createLayout(): {
  sectionsRoot: HTMLElement;
  statsRoot: HTMLElement;
  sentinel: HTMLElement;
} {
  const app = document.querySelector<HTMLDivElement>("#app");
  if (!app) {
    throw new Error("Missing #app root.");
  }

  const page = document.createElement("main");
  page.className = "page";

  const sectionsRoot = document.createElement("div");
  sectionsRoot.className = "sections-root";

  const sentinel = document.createElement("div");
  sentinel.className = "sentinel";
  sentinel.setAttribute("aria-hidden", "true");

  const statsRoot = document.createElement("aside");
  statsRoot.className = "stats-panel";

  page.appendChild(sectionsRoot);
  page.appendChild(sentinel);
  app.appendChild(page);
  app.appendChild(statsRoot);

  return { sectionsRoot, statsRoot, sentinel };
}

function bootstrap(): void {
  const state = createInitialState();
  const snapshot = loadSnapshot();
  if (snapshot) {
    state.virtualMeters = snapshot.virtualMeters;
    state.renderedSectionCount = snapshot.renderedSectionCount;
    state.appendCount = snapshot.appendCount;
    state.messageCount = snapshot.messageCount;
    state.hiddenMessageCount = snapshot.hiddenMessageCount;
  }
  const { sectionsRoot, statsRoot, sentinel } = createLayout();

  const panel = new StatsPanel(statsRoot);
  const pool = new SectionPool(sectionsRoot, state, { initialSections: INITIAL_SECTIONS });
  pool.init();
  if (snapshot && snapshot.scrollY > 0) {
    const targetMinHeight = snapshot.scrollY + window.innerHeight * 1.2;
    let steps = 0;
    while (document.documentElement.scrollHeight < targetMinHeight && steps < RESTORE_MAX_STEPS) {
      for (let i = 0; i < RESTORE_BATCH; i += 1) {
        pool.appendForRestore();
      }
      steps += 1;
    }
    pool.setNextSectionIndex(state.renderedSectionCount);
    window.scrollTo({ top: snapshot.scrollY, left: 0, behavior: "auto" });
    state.lastScrollY = snapshot.scrollY;
  }
  panel.render(state);

  let persistTimer: number | null = null;
  const scheduleSave = (): void => {
    if (persistTimer !== null) {
      return;
    }
    persistTimer = window.setTimeout(() => {
      saveSnapshot(state);
      persistTimer = null;
    }, 150);
  };

  const engine = new ScrollEngine(
    sentinel,
    {
      recycleBatch: APPEND_BATCH,
      sentinelMargin: "25%"
    },
    {
      onNeedRecycle: (batch) => {
        for (let i = 0; i < batch; i += 1) {
          pool.appendOnce();
        }
        panel.render(state);
        scheduleSave();
      }
    }
  );
  engine.start();

  window.addEventListener(
    "scroll",
    () => {
      accumulateVirtualDistance(state);
      panel.render(state);
      scheduleSave();
    },
    { passive: true }
  );

  window.addEventListener("beforeunload", () => {
    saveSnapshot(state);
  });
}

bootstrap();
