export class AnimatedValue {
  private start: number;
  private end: number;
  private startTime: number | undefined;
  private endTime: number | undefined;
  private readonly animationDuration;
  private readonly timingFunction;

  public constructor({
    initialValue,
    animationDuration,
    timingFunction = AnimatedValue.TIMING_FUNCTIONS.EASE_IN_OUT,
  }: {
    animationDuration: number;
    initialValue: number;
    timingFunction?: (x: number) => number;
  }) {
    this.timingFunction = timingFunction;
    this.animationDuration = animationDuration;
    this.start = initialValue;
    this.end = initialValue;
  }

  public animateTo({
    value,
    currentTime,
    animationDuration = this.animationDuration,
  }: {
    value: number;
    currentTime: number;
    animationDuration?: number;
  }) {
    this.start = this.getCurrentValue(currentTime); // do not move this live below time assignments
    this.end = value;

    this.startTime = currentTime;
    this.endTime = currentTime + animationDuration;
  }

  public set({ value, currentTime }: { value: number; currentTime: number }) {
    this.start = value;
    this.end = value;
    this.startTime = currentTime;
    this.endTime = currentTime;
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

  public reachedTheEndTime(currentTime: number) {
    return this.endTime ? this.endTime <= currentTime : false;
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
