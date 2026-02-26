import type { TrackedValueComparator } from "./models";

export type TrackedValueParams<T> = {
  comparator?: TrackedValueComparator<T>;
};

export class TrackedValue<T> {
  private value?: T;
  private changed: boolean = false;
  public static defaultComparator = <T>(prev: T | undefined, next: T) =>
    prev === next;

  public constructor(
    private readonly comparator = TrackedValue.defaultComparator<T>,
  ) {}

  public getValue(): T {
    if (this.value === undefined) {
      throw new Error("Trying to read uninitialized value");
    }
    return this.value;
  }

  public setValue(value: T) {
    const areDifferent = this.comparator(this.value, value) === false;
    if (areDifferent) {
      this.value = value;
      this.changed = true;
    }
  }

  public hasChanged() {
    return this.changed;
  }

  public notChanged() {
    this.changed = false;
  }
}
