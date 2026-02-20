import { AnimatedValue } from "./AnimatedValue";

export class AnimatedArray {
  private array: AnimatedValue[] = [];

  public constructor(
    private readonly animationDuration: number,
    initialValues?: number[],
    private readonly initialValueForItem?: number,
    private readonly timingFunction?: AnimatedValue["timingFunction"],
  ) {
    if (initialValues) {
      this.array = initialValues.map(
        (v) => new AnimatedValue(animationDuration, v, timingFunction),
      );
    }
  }

  public animateTo({
    values,
    startTime,
  }: {
    values: number[];
    startTime: number;
  }) {
    const len = Math.max(values.length, this.array.length);
    for (let i = 0; i < len; i++) {
      const newValue = values[i];
      const animatedValue = this.array[i];

      if (animatedValue !== undefined && newValue !== undefined) {
        animatedValue.animateTo({
          value: newValue,
          startTime,
        });
      } else if (animatedValue === undefined) {
        // add new animation value fro new item, start from  `initialValueForItem` then grow up to `newValue`
        const newAnimatedValue = new AnimatedValue(
          this.animationDuration,
          this.initialValueForItem ?? newValue,
          this.timingFunction,
        );
        newAnimatedValue.animateTo({
          value: newValue,
          startTime,
        });
        this.array.push(newAnimatedValue);
      } else if (newValue === undefined) {
        // animate down to `initialValueForItem`, then remove item from array
        animatedValue.animateTo({
          value:
            this.initialValueForItem ??
            animatedValue.getCurrentValue(startTime)!,
          startTime,
        });
      }
    }
  }

  public forceToEnd(time: number) {
    this.array.forEach((x) => x.forceToEnd(time));
  }

  // public runAnimationStep(currentTime: number) {
  //   this.array.forEach((x) => x.runAnimationStep(currentTime));
  // }

  public getCurrentValue(currentTime: number) {
    return this.array.map((x) => x.getCurrentValue(currentTime)!);
  }

  public getEndValue() {
    return this.array.map((x) => x.getEndValue()!);
  }
}
