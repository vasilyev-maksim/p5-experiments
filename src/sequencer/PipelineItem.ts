import { Event } from "../utils";

export class PipelineItem {
  private _next: PipelineItem | null = null;
  private _prev: PipelineItem | null = null;
  private _completed: boolean = false;
  public onNext = new Event<PipelineItem | null>();

  public constructor(
    private readonly _cb: (next: () => void, runningBackwards: boolean) => void,
    public readonly description?: string
  ) {}

  public run(): void {
    if (this._completed) {
      this._cb(() => {
        this._completed = true;
        this.onNext.__invokeCallbacks(this._next);
        this._next?.run();
      }, false);
    }
  }

  public runBackwards(): void {
    if (this._completed) {
      this._cb(() => {
        this._completed = true;
        this.onNext.__invokeCallbacks(this._prev);
        this._prev?.run();
      }, true);
    }
  }

  public bindNext(nextItem: PipelineItem) {
    this._next = nextItem;
  }

  public bindPrev(prevItem: PipelineItem) {
    this._prev = prevItem;
  }
}
