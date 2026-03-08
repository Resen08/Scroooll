import type { AppState } from "../state/app-state";

export class StatsPanel {
  private readonly root: HTMLElement;
  private readonly distanceEl: HTMLElement;
  private readonly messagesEl: HTMLElement;
  private readonly hiddenEl: HTMLElement;

  constructor(root: HTMLElement) {
    this.root = root;
    this.distanceEl = this.makeRow("거리", "0.0m");
    this.messagesEl = this.makeRow("메시지", "0");
    this.hiddenEl = this.makeRow("숨겨진 메시지", "0");
    this.makeActions();
  }

  render(state: AppState): void {
    this.distanceEl.textContent = `${state.virtualMeters.toFixed(1)}m`;
    this.messagesEl.textContent = String(state.messageCount);
    this.hiddenEl.textContent = String(state.hiddenMessageCount);
  }

  private makeRow(labelText: string, valueText: string): HTMLElement {
    const row = document.createElement("div");
    row.className = "stats-row";

    const label = document.createElement("span");
    label.className = "stats-label";
    label.textContent = labelText;

    const value = document.createElement("strong");
    value.className = "stats-value";
    value.textContent = valueText;

    row.appendChild(label);
    row.appendChild(value);
    this.root.appendChild(row);
    return value;
  }

  private makeActions(): void {
    const actions = document.createElement("div");
    actions.className = "stats-actions";

    const upButton = document.createElement("button");
    upButton.className = "stats-btn";
    upButton.type = "button";
    upButton.textContent = "올라가기";
    upButton.addEventListener("click", () => {
      window.scrollBy({
        top: Math.round(window.innerHeight * -0.9),
        behavior: "smooth"
      });
    });

    const topButton = document.createElement("button");
    topButton.className = "stats-btn";
    topButton.type = "button";
    topButton.textContent = "다시 올라가기";
    topButton.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });

    actions.appendChild(upButton);
    actions.appendChild(topButton);
    this.root.appendChild(actions);
  }
}
