import { Deferred } from "../utils";
import { SegmentBase } from "./SegmentBase";

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
