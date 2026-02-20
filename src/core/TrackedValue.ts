import { Event } from "@/utils/Event";
import type { TrackedValueComparator } from "./models";

export class TrackedValue<T> {
  public static defaultComparator = <T>(a?: T, b?: T) => a === b;
  private _value: T;
  private _prevValue?: T;
  public onChanged = new Event<T>();

  public get value(): T {
    return this._value;
  }

  public set value(val: T) {
    const areDifferent = this.comparator(val, this._value) === false;

    if (areDifferent) {
      this._prevValue = this._value;
      this._value = val;

      this.onChanged.__invokeCallbacks(val);
    }
  }

  public constructor(
    value: T,
    private readonly comparator: TrackedValueComparator<T> = TrackedValue.defaultComparator,
  ) {
    this._value = value;
    // this._prevValue = initValue;
  }

  public get prevValue() {
    return this._prevValue;
  }

  public static unboxValue<T>(arg: T | TrackedValue<T>): T {
    return arg instanceof TrackedValue ? arg.value : arg;
  }

  public static boxValue<T>(
    arg: T | TrackedValue<T>,
    comparator: TrackedValueComparator<T>,
  ): TrackedValue<T> {
    return arg instanceof TrackedValue
      ? arg
      : new TrackedValue(arg, comparator);
  }
}
