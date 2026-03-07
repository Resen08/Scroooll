import type { AppState } from "./app-state";

const STORAGE_KEY = "void_scroll_token_v1";

export interface PersistedSnapshot {
  virtualMeters: number;
  renderedSectionCount: number;
  appendCount: number;
  messageCount: number;
  hiddenMessageCount: number;
  scrollY: number;
}

function toFiniteNumber(value: unknown, fallback: number): number {
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}

export function loadSnapshot(): PersistedSnapshot | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return null;
    }
    const parsed = JSON.parse(raw) as Partial<PersistedSnapshot>;
    return {
      virtualMeters: Math.max(0, toFiniteNumber(parsed.virtualMeters, 0)),
      renderedSectionCount: Math.max(0, Math.floor(toFiniteNumber(parsed.renderedSectionCount, 0))),
      appendCount: Math.max(0, Math.floor(toFiniteNumber(parsed.appendCount, 0))),
      messageCount: Math.max(0, Math.floor(toFiniteNumber(parsed.messageCount, 0))),
      hiddenMessageCount: Math.max(0, Math.floor(toFiniteNumber(parsed.hiddenMessageCount, 0))),
      scrollY: Math.max(0, toFiniteNumber(parsed.scrollY, 0))
    };
  } catch {
    return null;
  }
}

export function saveSnapshot(state: AppState): void {
  const snapshot: PersistedSnapshot = {
    virtualMeters: state.virtualMeters,
    renderedSectionCount: state.renderedSectionCount,
    appendCount: state.appendCount,
    messageCount: state.messageCount,
    hiddenMessageCount: state.hiddenMessageCount,
    scrollY: window.scrollY
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(snapshot));
}

