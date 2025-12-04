// import { Pipeline } from "./Pipeline";
import { Deferred, delay, Event } from "../utils";

export class Sequence {
  private _activeSegmentIndex: number = 0;
  private _segments: Segment[] = [];
  public readonly onSegmentActivation = new Event<Segment>();

  public get activeSegment() {
    return this._activeSegmentIndex
      ? this._segments[this._activeSegmentIndex]
      : null;
  }

  public constructor(public readonly id: string, segments: Segment[] = []) {
    if (segments) {
      this.addSegments(segments);
    }
  }

  public addSegment(segment: Segment) {
    this._segments.push(segment);
  }

  public addSegments(segments: Segment[]) {
    segments.forEach((step) => this.addSegment(step));
  }

  public start = async () => {
    this.reset();

    if (this._segments.length > 0) {
      Sequence.asyncWhile(
        () => this._activeSegmentIndex < this._segments.length,
        async () => {
          const seg = this._segments[this._activeSegmentIndex];
          this.onSegmentActivation.__invokeCallbacks(seg);

          if (seg.delay > 0) {
            seg.currentPhase = "delay";
            await delay(seg.delay);
          }

          if (seg instanceof SyncSegment) {
            if (seg.duration > 0) {
              seg.currentPhase = "running";
              await delay(seg.duration);
            }
          } else {
            seg.currentPhase = "running";
            await seg.promise;
          }

          seg.currentPhase = "completed";
          this._activeSegmentIndex++;
        }
      );
    }
  };

  private static asyncWhile(
    condition: () => boolean,
    cb: () => Promise<unknown>
  ) {
    const f = () => {
      if (condition()) {
        cb().then(f);
      }
    };

    f();
  }

  public reset = () => {
    this._activeSegmentIndex = 0;
    this._segments.forEach((seg) => seg.reset());
  };

  public getSegmentById = (id: Segment["id"]) => {
    return this._segments.find((x) => x.id === id);
  };

  // public get activeSegment() {
  //   // return this._pipeline.activeItem;
  // }

  // public completeCurrentStep = () => {
  //   this._pipeline.activeRunner?.forceComplete();
  // };

  // public pause = () => {};

  public static syncSegment(args: {
    id: string;
    delay?: SyncSegment["delay"];
    duration?: SyncSegment["duration"];
  }): SyncSegment {
    return new SyncSegment(args.id, args.delay, args.duration);
  }

  public static asyncSegment<Payload = void>(args: {
    id: string;
    delay?: SyncSegment["delay"];
    timingPayload: Payload;
  }): AsyncSegment<Payload> {
    return new AsyncSegment<Payload>(args.id, args.delay, args.timingPayload);
  }
}

export type SegmentPhase = "not_started" | "delay" | "running" | "completed";

export type Segment<Payload = unknown> = SyncSegment | AsyncSegment<Payload>;

class SegmentBase {
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

export class SyncSegment extends SegmentBase {
  public constructor(
    public readonly id: string,
    public readonly delay: number = 0,
    public readonly duration: number = 0
  ) {
    super(id, delay);

    if ((this.duration ?? 0) < 0) {
      throw new Error(
        `duration should be non-negative ("${this.duration}" provided)`
      );
    }
  }
}

export class AsyncSegment<Payload = void> extends SegmentBase {
  private _deferred = new Deferred();

  public get promise() {
    return this._deferred.promise;
  }

  public complete = () => {
    this._deferred.resolve();
  };

  public constructor(
    public readonly id: string,
    public readonly delay: number = 0,
    public readonly timingPayload: Payload
  ) {
    super(id, delay);
  }

  public override reset = () => {
    super.reset();
    this._deferred = new Deferred();
  };
}
