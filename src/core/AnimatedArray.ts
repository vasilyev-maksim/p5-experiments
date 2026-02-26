import { AnimatedValue } from "./AnimatedValue";

export class AnimatedArray {
  private array: AnimatedValue[] = [];
  private garbage = new Set<AnimatedValue>();
  private readonly animationDuration;
  private readonly initialValueForItem;
  private readonly timingFunction;

  public constructor({
    animationDuration,
    initialValues,
    initialValueForItem,
    timingFunction,
  }: {
    animationDuration: number;
    initialValues: number[];
    initialValueForItem?: number;
    timingFunction?: AnimatedValue["timingFunction"];
  }) {
    this.animationDuration = animationDuration;
    this.initialValueForItem = initialValueForItem;
    this.timingFunction = timingFunction;
    this.array = initialValues.map(
      (initialValue) =>
        new AnimatedValue({
          animationDuration,
          initialValue,
          timingFunction,
        }),
    );
  }

  public animateTo({
    values,
    currentTime,
    animationDuration = this.animationDuration,
  }: {
    values: number[];
    currentTime: number;
    animationDuration?: number;
  }) {
    const len = Math.max(values.length, this.array.length);
    for (let i = 0; i < len; i++) {
      const newValue = values[i];
      const animatedValue = this.array[i];

      if (animatedValue !== undefined && newValue !== undefined) {
        animatedValue.animateTo({
          value: newValue,
          currentTime,
          animationDuration,
        });
        // if exit animation was canceled mid way, value will be rescued (removed from `garbage`)
        this.garbage.delete(animatedValue);
      } else if (animatedValue === undefined) {
        // add new animation value for new item, start from  `initialValueForItem` then grow up to `newValue`
        const newAnimatedValue = new AnimatedValue({
          animationDuration: this.animationDuration,
          initialValue: this.initialValueForItem ?? newValue,
          timingFunction: this.timingFunction,
        });
        newAnimatedValue.animateTo({
          value: newValue,
          currentTime,
          animationDuration,
        });
        this.array.push(newAnimatedValue);
      } else if (newValue === undefined) {
        if (this.garbage.has(animatedValue) === false) {
          // animate down to `initialValueForItem`
          animatedValue.animateTo({
            value:
              this.initialValueForItem ??
              animatedValue.getCurrentValue(currentTime)!,
            currentTime,
            animationDuration,
          });
          // then mark it to be garbage collected from array
          this.garbage.add(animatedValue);
        }
      }
    }
  }

  public getCurrentValue(currentTime: number) {
    this.garbageCollect(currentTime);
    return this.array.map((x) => x.getCurrentValue(currentTime)!);
  }

  public getEndValue() {
    return this.array.map((x) => x.getEndValue()!);
  }

  // remove all items contained in `garbage`
  private garbageCollect(currentTime: number) {
    this.array = this.array.filter((x) => {
      const shouldBeCollected =
        x.reachedTheEnd(currentTime) && this.garbage.has(x);

      if (shouldBeCollected) {
        this.garbage.delete(x); // remove from garbage
      }
      return shouldBeCollected === false;
    });
  }
}
