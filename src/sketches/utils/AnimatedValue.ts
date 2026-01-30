export class AnimatedValue {
  private start: number | undefined;
  private interpolated: number | undefined;
  private destination: number | undefined;
  private startTime: number | undefined;
  private endTime: number | undefined;
  private onAnimationEnd?: (finalValue: number) => void;

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

  public animateTo({
    value,
    startTime,
    animationDuration,
    onAnimationEnd,
  }: {
    value: number;
    startTime: number;
    animationDuration?: number;
    onAnimationEnd?: (finalValue: number) => void;
  }) {
    this.startTime = startTime;
    this.endTime = startTime + (animationDuration ?? this.animationDuration);
    this.start = this.start === undefined ? value : this.interpolated;
    this.interpolated = this.start;
    this.destination = value;
    this.onAnimationEnd = onAnimationEnd;
  }

  public runAnimationStep(currentTime: number) {
    if (this.startTime !== undefined && this.endTime !== undefined) {
      if (currentTime > this.endTime) {
        currentTime = this.endTime;
      } else if (currentTime < this.startTime) {
        currentTime = this.startTime;
      }

      if (
        this.destination !== undefined &&
        this.start !== undefined &&
        this.destination !== this.start &&
        this.interpolated !== undefined
      ) {
        const ratio =
          (currentTime - this.startTime) / (this.endTime - this.startTime);
        this.interpolated =
          this.start + ratio * (this.destination - this.start);

        if (ratio === 1 && this.onAnimationEnd !== undefined) {
          this.onAnimationEnd(this.interpolated);
          this.onAnimationEnd = undefined;
        }
      }
    }
  }

  public getCurrentValue() {
    return this.interpolated;
  }

  public getDestinationValue() {
    return this.destination;
  }

  public getStartValue() {
    return this.start;
  }

  public getProgress() {
    if (
      this.interpolated !== undefined &&
      this.start !== undefined &&
      this.destination !== undefined
    ) {
      return (this.interpolated - this.start) / (this.destination - this.start);
    }
  }
}
