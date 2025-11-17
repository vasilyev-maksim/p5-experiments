import type { IPipelineItem } from "./models";

export class Pipeline {
  private _items: IPipelineItem[] = [];

  private get _firstItem(): IPipelineItem | null {
    return this._items[0] ?? null;
  }

  private get _lastItem(): IPipelineItem | null {
    return this._items[this._items.length - 1] ?? null;
  }

  public addItem(item: IPipelineItem): void {
    if (this._lastItem) {
      item.bindPrev(this._lastItem);
    }
    this._lastItem?.bindNext(item);
    this._items.push(item);
  }

  public run(): void {
    this._firstItem?.run();
  }

  public runBackwards(): void {
    this._firstItem?.runBackwards();
  }
}
