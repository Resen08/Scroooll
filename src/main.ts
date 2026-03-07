import { createInitialState, accumulateVirtualDistance } from "./state/app-state";
import { SectionPool } from "./engine/section-pool";
import { ScrollEngine } from "./engine/scroll-engine";
import { StatsPanel } from "./ui/stats-panel";

const INITIAL_SECTIONS = 20;
const APPEND_BATCH = 4;

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
  const { sectionsRoot, statsRoot, sentinel } = createLayout();

  const panel = new StatsPanel(statsRoot);
  const pool = new SectionPool(sectionsRoot, state, { initialSections: INITIAL_SECTIONS });
  pool.init();
  panel.render(state);

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
      }
    }
  );
  engine.start();

  window.addEventListener(
    "scroll",
    () => {
      accumulateVirtualDistance(state);
      panel.render(state);
    },
    { passive: true }
  );
}

bootstrap();
