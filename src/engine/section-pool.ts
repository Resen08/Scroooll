import type { AppState } from "../state/app-state";
import { generateSectionContent } from "./content-generator";
import { createSectionElement, updateSectionElement } from "../ui/section-view";

export interface SectionPoolConfig {
  initialSections: number;
}

interface AppendOptions {
  trackState: boolean;
}

export class SectionPool {
  private readonly container: HTMLElement;
  private readonly state: AppState;
  private readonly initialSections: number;
  private nextSectionIndex = 0;

  constructor(container: HTMLElement, state: AppState, config: SectionPoolConfig) {
    this.container = container;
    this.state = state;
    this.initialSections = config.initialSections;
    this.nextSectionIndex = state.renderedSectionCount;
  }

  init(): void {
    for (let i = 0; i < this.initialSections; i += 1) {
      this.appendOnce();
    }
  }

  appendOnce(): void {
    const section = createSectionElement();
    this.fillSection(section, { trackState: true });
    this.container.appendChild(section);
    this.state.appendCount += 1;
  }

  appendForRestore(): void {
    const section = createSectionElement();
    this.fillSection(section, { trackState: false });
    this.container.appendChild(section);
  }

  setNextSectionIndex(index: number): void {
    this.nextSectionIndex = Math.max(0, Math.floor(index));
  }

  private fillSection(section: HTMLElement, options: AppendOptions): void {
    const content = generateSectionContent(this.nextSectionIndex);
    updateSectionElement(section, content);
    this.nextSectionIndex += 1;
    if (options.trackState) {
      this.state.renderedSectionCount += 1;
      if (content.hasMessage) {
        this.state.messageCount += 1;
      }
      if (content.isHiddenMessage) {
        this.state.hiddenMessageCount += 1;
      }
    }
  }
}
