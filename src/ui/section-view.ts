import type { GeneratedSectionContent } from "../engine/content-generator";

export function createSectionElement(): HTMLElement {
  const section = document.createElement("section");
  section.className = "void-section";

  const label = document.createElement("p");
  label.className = "void-label";
  section.appendChild(label);

  return section;
}

export function updateSectionElement(section: HTMLElement, content: GeneratedSectionContent): void {
  section.style.minHeight = `${content.minHeightPx}px`;
  const label = section.querySelector(".void-label");
  if (!label) {
    return;
  }
  label.textContent = content.text;
  label.classList.toggle("muted", !content.hasMessage);
  label.classList.toggle("emerald", content.isHiddenMessage);
}
