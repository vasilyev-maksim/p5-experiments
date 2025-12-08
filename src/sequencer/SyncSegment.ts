import { SegmentBase } from "./SegmentBase";

export class SyncSegment extends SegmentBase {
  public constructor(
    id: string,
    delay: number = 0,
    public readonly duration: number = 0,
    __enabledIf?: (ctx: unknown) => boolean
  ) {
    super(id, delay, __enabledIf);

    if ((this.duration ?? 0) < 0) {
      throw new Error(
        `duration should be non-negative ("${this.duration}" provided)`
      );
    }
  }
}
