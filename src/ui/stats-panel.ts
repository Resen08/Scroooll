import type { AppState } from "../state/app-state";

export class StatsPanel {
  private readonly root: HTMLElement;
  private readonly distanceEl: HTMLElement;
  private readonly sectionsEl: HTMLElement;
  private readonly messagesEl: HTMLElement;

  constructor(root: HTMLElement) {
    this.root = root;
    this.distanceEl = this.makeRow("거리", "0.0m");
    this.sectionsEl = this.makeRow("D-구역", "0");
    this.messagesEl = this.makeRow("void messages", "0");
  }

  render(state: AppState): void {
    this.distanceEl.textContent = `${state.virtualMeters.toFixed(1)}m`;
    this.sectionsEl.textContent = String(state.renderedSectionCount);
    this.messagesEl.textContent = String(state.messageCount);
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
}
