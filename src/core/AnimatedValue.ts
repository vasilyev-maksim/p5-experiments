export class AnimatedValue {
  private start: number;
  private end: number;
  private startTime: number | undefined;
  private endTime: number | undefined;

  public constructor(
    private readonly animationDuration: number,
    initialValue: number,
    private readonly timingFunction: (x: number) => number = AnimatedValue
      .TIMING_FUNCTIONS.EASE_IN_OUT,
  ) {
    this.start = initialValue;
    this.end = initialValue;
  }

  public animateTo({
    value,
    currentTime,
    animationDuration,
  }: {
    value: number;
    currentTime: number;
    animationDuration?: number;
  }) {
    this.start = this.getCurrentValue(currentTime); // do not move this live below time assignments
    this.end = value;
    this.startTime = currentTime;
    this.endTime = currentTime + (animationDuration ?? this.animationDuration);
  }

  public getCurrentValue(currentTime: number) {
    if (this.startTime !== undefined && this.endTime !== undefined) {
      if (this.endTime === this.startTime || this.start === this.end) {
        return this.end;
      } else {
        if (currentTime > this.endTime) {
          currentTime = this.endTime;
          return this.end;
        } else if (currentTime < this.startTime) {
          currentTime = this.startTime;
          return this.start;
        } else {
          const ratio =
            (currentTime - this.startTime) / (this.endTime - this.startTime);
          const curr =
            this.start + this.timingFunction(ratio) * (this.end - this.start);

          return curr;
        }
      }
    } else {
      return this.end;
    }
  }

  public getEndValue() {
    return this.end;
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
