import { Event } from "../utils";

export class PipelineItem {
  public next: PipelineItem | null = null;
  public prev: PipelineItem | null = null;
  public onNext = new Event<PipelineItem>();
  public onPrev = new Event<PipelineItem>();
  // private _completed: boolean = false;

  public constructor(
    public readonly callback: (
      next: () => void,
      runningBackwards: boolean
    ) => void,
    public readonly description?: string
  ) {}

  public run(): void {
    // if (this._completed) {
    this.callback(() => {
      // this._completed = true;
      this.onNext.__invokeCallbacks(this);
      this.next?.run();
    }, false);
    // }
  }

  public runBackwards(): void {
    // if (this._completed) {
    this.callback(() => {
      // this._completed = true;
      this.onPrev.__invokeCallbacks(this);
      this.prev?.run();
    }, true);
    // }
  }

  // public forceComplete() {
  //   this._completed = true;
  // }

  // public reset() {
  //   // TODO: there is a problem with async code execution (item's callback may be still running)
  //   this._completed = false;
  // }
}
