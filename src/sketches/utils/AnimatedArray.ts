import { AnimatedValue, type IAnimatedValue } from "./AnimatedValue";

export class AnimatedArray implements IAnimatedValue<number[]> {
  private array: AnimatedValue[] = [];

  public constructor(
    private readonly animationDuration: number,
    initialValues?: number[],
  ) {
    if (initialValues) {
      this.array = initialValues.map(
        (v) => new AnimatedValue(animationDuration, v),
      );
    }
  }

  public animateTo(
    values: number[],
    startTime: number,
    initialValueForItem: number,
    animationDuration?: number,
  ) {
    this.array = values.map((v, i) => {
      let item = this.array[i];
      const duration = animationDuration ?? this.animationDuration;

      if (!item) {
        item = new AnimatedValue(duration, initialValueForItem ?? v);
        this.array[i] = item;
      }

      item.animateTo(v, startTime, duration);

      return item;
    });
  }

  public runAnimationStep(currentTime: number) {
    this.array.forEach((x) => x.runAnimationStep(currentTime));
  }

  public getCurrentValue() {
    return this.array.map((x) => x.getCurrentValue()!);
  }

  public getDestinationValue() {
    return this.array.map((x) => x.getDestinationValue()!);
  }
}
