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
    startTime,
    animationDuration,
  }: {
    value: number;
    startTime: number;
    animationDuration?: number;
  }) {
    this.startTime = startTime;
    this.endTime = startTime + (animationDuration ?? this.animationDuration);
    this.start = this.getCurrentValue(startTime);
    this.end = value;
  }

  public forceToEnd(time: number) {
    this.endTime = time;
  }

  public getCurrentValue(currentTime: number) {
    if (this.startTime !== undefined && this.endTime !== undefined) {
      if (this.endTime === this.startTime || this.start === this.end) {
        return this.end;
      } else {
        if (currentTime > this.endTime) {
          currentTime = this.endTime;
        } else if (currentTime < this.startTime) {
          currentTime = this.startTime;
        }

        const ratio =
          (currentTime - this.startTime) / (this.endTime - this.startTime);

        const curr =
          this.start + this.timingFunction(ratio) * (this.end - this.start);

        return curr;
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
