export class AnimatedValue {
  private start: number | undefined;
  private interpolated: number | undefined;
  private destination: number | undefined;
  private startTime: number | undefined;
  private endTime: number | undefined;

  public constructor(
    private readonly animationDuration: number,
    initialValue?: number,
  ) {
    if (initialValue !== undefined) {
      this.start = initialValue;
      this.interpolated = initialValue;
      this.destination = initialValue;
    }
  }

  public animateTo(val: number, startTime: number, animationDuration?: number) {
    this.startTime = startTime;
    this.endTime = startTime + (animationDuration ?? this.animationDuration);
    this.start = this.start === undefined ? val : this.interpolated;
    this.interpolated = this.start;
    this.destination = val;
  }

  public runAnimationStep(currentTime: number) {
    if (
      this.startTime !== undefined &&
      this.endTime !== undefined &&
      this.startTime <= currentTime &&
      this.endTime >= currentTime &&
      this.destination !== undefined &&
      this.start !== undefined &&
      this.destination !== this.start &&
      this.interpolated !== undefined
    ) {
      const ratio =
        (currentTime - this.startTime) / (this.endTime - this.startTime);
      const old = this.interpolated;
      this.interpolated = this.start + ratio * (this.destination - this.start);
      console.log({ diff: this.interpolated - old });
    }
  }

  public getCurrentValue() {
    return this.interpolated;
  }

  public getDestinationValue() {
    return this.destination;
  }
}
