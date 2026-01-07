import { Event } from "../utils";
import { SegmentPhase } from "./models";

export class SegmentBase {
  private __phase: SegmentPhase = SegmentPhase.NotStarted;
  public onPhaseChange = new Event<SegmentPhase>();

  public __setPhase(phase: SegmentPhase) {
    this.__phase = phase;
    this.onPhaseChange.__invokeCallbacks(phase);
  }

  public get isRunning() {
    return this.__phase === SegmentPhase.Running;
  }

  public get wasRun() {
    return this.__phase >= SegmentPhase.Running;
  }

  public get completed() {
    return this.__phase === SegmentPhase.Completed;
  }

  public constructor(
    public readonly id: string,
    public readonly delay: number = 0,
    private readonly __disabledIf?: (ctx: unknown) => boolean
  ) {
    if (this.delay < 0) {
      throw new Error(
        `delay should be non-negative ("${this.delay}" provided)`
      );
    }
  }

  public reset() {
    this.__setPhase(SegmentPhase.NotStarted);
  }

  public isDisabled(ctx: unknown) {
    return this.__disabledIf?.(ctx) ?? false;
  }
}
