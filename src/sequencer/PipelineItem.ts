import type { IPipelineItem } from "./models";

export class PipelineItem implements IPipelineItem {
  private _nextItem: IPipelineItem | null = null;
  private _prevItem: IPipelineItem | null = null;

  public constructor(
    private readonly _cb: (next: () => void, runningBackwards: boolean) => void,
    public readonly description?: string
  ) {}

  public run(): void {
    this._cb(() => this._nextItem?.run(), false);
  }

  public runBackwards(): void {
    this._cb(() => this._prevItem?.run(), true);
  }

  public bindNext(nextItem: IPipelineItem) {
    this._nextItem = nextItem;
  }

  public bindPrev(prevItem: IPipelineItem) {
    this._prevItem = prevItem;
  }
}
