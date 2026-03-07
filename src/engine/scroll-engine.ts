export interface ScrollEngineConfig {
  sentinelMargin: string;
  recycleBatch: number;
}

export interface ScrollEngineHandlers {
  onNeedRecycle: (batch: number) => void;
}

export class ScrollEngine {
  private observer: IntersectionObserver | null = null;
  private readonly sentinel: HTMLElement;
  private readonly config: ScrollEngineConfig;
  private readonly handlers: ScrollEngineHandlers;
  private busy = false;

  constructor(sentinel: HTMLElement, config: ScrollEngineConfig, handlers: ScrollEngineHandlers) {
    this.sentinel = sentinel;
    this.config = config;
    this.handlers = handlers;
  }

  start(): void {
    this.observer = new IntersectionObserver(
      (entries) => {
        const hit = entries.some((entry) => entry.isIntersecting);
        if (hit) {
          this.triggerRecycle();
        }
      },
      { root: null, rootMargin: `0px 0px ${this.config.sentinelMargin} 0px` }
    );
    this.observer.observe(this.sentinel);
  }

  stop(): void {
    this.observer?.disconnect();
    this.observer = null;
  }

  private triggerRecycle(): void {
    if (this.busy) {
      return;
    }
    this.busy = true;
    this.handlers.onNeedRecycle(this.config.recycleBatch);
    this.busy = false;
  }
}

