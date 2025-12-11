import { asyncWhile, delay, Event } from "../utils";
import { AsyncSegment } from "./AsyncSegment";
import { SegmentPhase } from "./models";
import type { SegmentBase } from "./SegmentBase";
import { SyncSegment } from "./SyncSegment";

export class Sequence {
  private _activeSegmentIndex: number = -1;
  private _segments: SegmentBase[] = [];
  public readonly onProgress = new Event<SegmentBase>();

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
      asyncWhile(
        () => this._activeSegmentIndex < this._segments.length - 1,
        async () => {
          this._activeSegmentIndex++;
          const seg = this._segments[this._activeSegmentIndex];

          this.onProgress.__invokeCallbacks(seg);
          const cleanup = seg.onPhaseChange.addCallback(() =>
            this.onProgress.__invokeCallbacks(seg)
          );

          const disabled = seg.isDisabled(ctx); // TODO: should be accessible in components too (without knowing ctx)
          if (!disabled) {
            if (seg.delay > 0) {
              seg.__setPhase(SegmentPhase.Delay);
              await delay(seg.delay);
            }

            if (seg instanceof SyncSegment) {
              seg.__setPhase(SegmentPhase.Running);

              if (seg.duration > 0) {
                await delay(seg.duration);
              }
            } else if (seg instanceof AsyncSegment) {
              seg.__setPhase(SegmentPhase.Running);
              await seg.promise;
            }

            seg.__setPhase(SegmentPhase.Completed);
          }

          cleanup();
        },
        // cleanups
        () => {
          // this.reset();
        }
      );
    }
  };

  public reset = () => {
    this._activeSegmentIndex = -1;
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
