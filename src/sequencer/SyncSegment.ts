import { SegmentBase } from "./SegmentBase";

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
