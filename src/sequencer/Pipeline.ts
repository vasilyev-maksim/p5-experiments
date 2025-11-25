import { PipelineItemRunner, type PipelineItem } from "./PipelineItem";

export class Pipeline {
  private _runners: PipelineItemRunner[] = [];
  private _activeRunner: PipelineItemRunner | null = null;

  private get _firstRunner(): PipelineItemRunner | null {
    return this._runners[0] ?? null;
  }

  private get _lastRunner(): PipelineItemRunner | null {
    return this._runners[this._runners.length - 1] ?? null;
  }

  public get activeRunner() {
    return this._activeRunner;
  }

  public addItem(item: PipelineItem): void {
    const runner = new PipelineItemRunner(item);

    runner.prev = this._lastRunner;
    if (this._lastRunner) {
      this._lastRunner.next = runner;
    }

    this._runners.push(runner);
  }

  public run(): void {
    this._activeRunner = this._firstRunner;
    this._firstRunner?.run((runner) => (this._activeRunner = runner.next));
  }

  public runNext(): void {
    
  }

  public runBackwards(): void {
    this._activeRunner = this._lastRunner;
    this._lastRunner?.runBackwards(
      (runner) => (this._activeRunner = runner.prev)
    );
  }
}
