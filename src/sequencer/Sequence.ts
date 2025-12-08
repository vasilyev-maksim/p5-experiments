import { delay, Event } from "../utils";
import { AsyncSegment } from "./AsyncSegment";
import type { SegmentBase } from "./SegmentBase";
import { SyncSegment } from "./SyncSegment";

export class Sequence {
  private _activeSegmentIndex: number = 0;
  private _segments: SegmentBase[] = [];
  public readonly onSegmentActivation = new Event<SegmentBase>();

  public get activeSegment() {
    return this._activeSegmentIndex
      ? this._segments[this._activeSegmentIndex]
      : null;
  }

  public constructor(public readonly id: string, segments: SegmentBase[] = []) {
    if (segments) {
      this.addSegments(segments);
    }
  }

  public addSegment(segment: SegmentBase) {
    this._segments.push(segment);
  }

  public addSegments(segments: SegmentBase[]) {
    segments.forEach((step) => this.addSegment(step));
  }

  public start = async (ctx: unknown) => {
    this.reset();

    if (this._segments.length > 0) {
      Sequence.asyncWhile(
        () => this._activeSegmentIndex < this._segments.length,
        async () => {
          const seg = this._segments[this._activeSegmentIndex];
          this.onSegmentActivation.__invokeCallbacks(seg);

          const disabled = seg.isDisabled(ctx);
          if (!disabled) {
            if (seg.delay > 0) {
              seg.currentPhase = "delay";
              await delay(seg.delay);
            }

            if (seg instanceof SyncSegment) {
              if (seg.duration > 0) {
                seg.currentPhase = "running";
                await delay(seg.duration);
              }
            } else if (seg instanceof AsyncSegment) {
              seg.currentPhase = "running";
              await seg.promise;
            }

            seg.currentPhase = "completed";
          } else {
            seg.currentPhase = "disabled";
          }

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

  public getSegmentById = (id: SegmentBase["id"]) => {
    return this._segments.find((x) => x.id === id);
  };

  public static syncSegment(args: {
    id: string;
    delay?: SyncSegment["delay"];
    duration?: SyncSegment["duration"];
    disabledIf?: (ctx: unknown) => boolean;
  }): SyncSegment {
    return new SyncSegment(args.id, args.delay, args.duration, args.disabledIf);
  }

  public static asyncSegment<Payload = unknown>(args: {
    id: string;
    delay?: SyncSegment["delay"];
    timingPayload: Payload;
    disabledIf?: (ctx: unknown) => boolean;
  }): AsyncSegment<Payload> {
    return new AsyncSegment<Payload>(
      args.id,
      args.delay,
      args.timingPayload,
      args.disabledIf
    );
  }
}
