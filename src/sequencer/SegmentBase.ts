import { Event } from "../utils";
import type { SegmentPhase } from "./Sequence";

export class SegmentBase {
  private _currentPhase: SegmentPhase = "not_started";
  public onPhaseChange = new Event<SegmentPhase>();

  public get currentPhase() {
    return this._currentPhase;
  }

  public set currentPhase(phase) {
    this._currentPhase = phase;
    this.onPhaseChange.__invokeCallbacks(phase);
  }

  public constructor(
    public readonly id: string,
    public readonly delay: number = 0
  ) {
    if (this.delay < 0) {
      throw new Error(
        `delay should be non-negative ("${this.delay}" provided)`
      );
    }
  }

  public reset() {
    this._currentPhase = "not_started";
  }
}
