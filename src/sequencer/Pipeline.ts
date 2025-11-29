import { PipelineItem } from "./PipelineItem";

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
    item.prev = this._lastItem;
    if (this._lastItem) {
      this._lastItem.next = item;
    }
    item.onNext.addCallback((item) => (this._activeItem = item.next));
    item.onPrev.addCallback((item) => (this._activeItem = item.prev));

    this._items.push(item);
  }

  public run(): void {
    this._activeItem = this._firstItem;
    this._firstItem?.run();
  }

  // public runNext(): void {}

  public runBackwards(): void {
    this._activeItem = this._lastItem;
    this._lastItem?.runBackwards();
  }
}
