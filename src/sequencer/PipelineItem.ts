export class PipelineItem {
  public constructor(
    public readonly callback: (
      next: () => void,
      runningBackwards: boolean
    ) => void,
    public readonly description?: string
  ) {}
}

export class PipelineItemRunner {
  public next: PipelineItemRunner | null = null;
  public prev: PipelineItemRunner | null = null;
  // private _completed: boolean = false;

  public constructor(public readonly item: PipelineItem) {}

  public run(onComplete: (next: PipelineItemRunner) => void): void {
    // if (this._completed) {
    this.item.callback(() => {
      // this._completed = true;
      onComplete(this);
      this.next?.run(onComplete);
    }, false);
    // }
  }

  public runBackwards(onComplete: (next: PipelineItemRunner) => void): void {
    // if (this._completed) {
    this.item.callback(() => {
      // this._completed = true;
      onComplete(this);
      this.prev?.run(onComplete);
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
