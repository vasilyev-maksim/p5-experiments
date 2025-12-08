import { Deferred } from "../utils";
import { SegmentBase } from "./SegmentBase";

export class AsyncSegment<Payload = unknown> extends SegmentBase {
  private _deferred = new Deferred();

  public get promise() {
    return this._deferred.promise;
  }

  public complete = () => {
    this._deferred.resolve();
  };

  public constructor(
    id: string,
    delay: number = 0,
    public readonly timingPayload: Payload,
    __enabledIf?: (ctx: unknown) => boolean
  ) {
    super(id, delay, __enabledIf);
  }

  public override reset = () => {
    super.reset();
    this._deferred = new Deferred();
  };
}
