export type TrackedValueComparator<T> = (a?: T, b?: T) => boolean;

export class TrackedValue<T> {
  private static DEFAULT_COMPARATOR = <T>(a?: T, b?: T) => a === b;
  private _value?: T;
  private _prevValue?: T;

  public set value(val: T) {
    this._prevValue = this._value;
    this._value = val;
  }

  public get value(): T {
    return this._value!;
    // if (this._value === undefined) {
    //   throw new Error("Can't access value of non-initialized tracked value.");
    // } else {
    // }
  }

  public get prevValue() {
    return this._prevValue;
  }

  public get hasChanged() {
    return this.comparator(this._prevValue, this._value) === false;
  }

  public constructor(
    initValue?: T,
    private readonly comparator: TrackedValueComparator<T> = TrackedValue.DEFAULT_COMPARATOR,
  ) {
    this._value = initValue;
    this._prevValue = initValue;
  }

  public static ArrayUtils = class {};
}
