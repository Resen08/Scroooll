import type { AppState } from "../state/app-state";
import { generateSectionContent } from "./content-generator";
import { createSectionElement, updateSectionElement } from "../ui/section-view";

export interface SectionPoolConfig {
  initialSections: number;
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
  }

  init(): void {
    for (let i = 0; i < this.initialSections; i += 1) {
      this.appendOnce();
    }
  }

  appendOnce(): void {
    const section = createSectionElement();
    this.fillSection(section);
    this.container.appendChild(section);
    this.state.appendCount += 1;
  }

  private fillSection(section: HTMLElement): void {
    const content = generateSectionContent(this.nextSectionIndex);
    updateSectionElement(section, content);
    this.nextSectionIndex += 1;
    this.state.renderedSectionCount += 1;
    if (content.hasMessage) {
      this.state.messageCount += 1;
    }
  }
}
