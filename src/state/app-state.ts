export interface AppState {
  lastScrollY: number;
  virtualMeters: number;
  renderedSectionCount: number;
  appendCount: number;
  messageCount: number;
  hiddenMessageCount: number;
}

export function createInitialState(): AppState {
  return {
    lastScrollY: window.scrollY,
    virtualMeters: 0,
    renderedSectionCount: 0,
    appendCount: 0,
    messageCount: 0,
    hiddenMessageCount: 0
  };
}

export function accumulateVirtualDistance(state: AppState): void {
  const nextY = window.scrollY;
  const delta = nextY - state.lastScrollY;
  state.lastScrollY = nextY;
  state.virtualMeters = Math.max(0, state.virtualMeters + delta * 0.012);
}
