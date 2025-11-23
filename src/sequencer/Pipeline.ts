import type { PipelineItem } from "./PipelineItem";

export class Pipeline {
  private _items: PipelineItem[] = [];
  private _activeItem: PipelineItem | null = null;

  private get _firstItem(): PipelineItem | null {
    return this._items[0] ?? null;
  }

  private get _lastItem(): PipelineItem | null {
    return this._items[this._items.length - 1] ?? null;
  }

  public get activeItem() {
    return this._activeItem;
  }

  public addItem(item: PipelineItem): void {
    if (this._lastItem) {
      item.bindPrev(this._lastItem);
      // item.onNext()
    }
    this._lastItem?.bindNext(item);
    this._items.push(item);
  }

  public run(): void {
    this._activeItem = this._firstItem;
    this._firstItem?.run();
  }

  public runBackwards(): void {
    this._firstItem?.runBackwards();
  }
}
