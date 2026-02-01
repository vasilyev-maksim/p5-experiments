export class AnimatedValue {
  private start: number | undefined;
  private interpolated: number | undefined;
  private end: number | undefined;
  private startTime: number | undefined;
  private endTime: number | undefined;
  private onAnimationEnd?: (finalValue: number) => void;

  public constructor(
    private readonly animationDuration: number,
    initialValue: number | undefined,
    private readonly timingFunction: (x: number) => number = AnimatedValue
      .TIMING_FUNCTIONS.EASE_IN_OUT,
  ) {
    if (initialValue !== undefined) {
      this.start = initialValue;
      this.interpolated = initialValue;
      this.end = initialValue;
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
    this.end = value;
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
        this.end !== undefined &&
        this.start !== undefined &&
        this.end !== this.start &&
        this.interpolated !== undefined
      ) {
        const ratio =
          (currentTime - this.startTime) / (this.endTime - this.startTime);

        this.interpolated =
          this.start + this.timingFunction(ratio) * (this.end - this.start);

        if (ratio === 1 && this.onAnimationEnd !== undefined) {
          this.onAnimationEnd(this.interpolated);
          this.onAnimationEnd = undefined;
        }
      }
    }
  }

  public forceToEnd(time: number) {
    this.interpolated = this.end;
    this.endTime = time;
  }

  public getCurrentValue() {
    return this.interpolated;
  }

  public getEndValue() {
    return this.end;
  }

  public getStartValue() {
    return this.start;
  }

  public getProgress() {
    if (
      this.interpolated !== undefined &&
      this.start !== undefined &&
      this.end !== undefined
    ) {
      return (this.interpolated - this.start) / (this.end - this.start);
    }
  }

  public static TIMING_FUNCTIONS = class {
    public static LINEAR(x: number) {
      return x;
    }

    public static QUADRATIC(x: number) {
      return x * x;
    }

    public static EASE_IN_OUT(x: number) {
      return x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2;
    }
  };
}
