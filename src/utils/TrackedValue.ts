/* eslint-disable @typescript-eslint/no-explicit-any */
export type TrackedValueComparator<T> = (a: T, b: T) => boolean;

export class TrackedValue<T> {
  private static DEFAULT_COMPARATOR = <T>(a: T, b: T) => a === b;
  private _value: T;
  private _prevValue: T;

  public set value(val: T) {
    this._prevValue = this._value;
    this._value = val;
  }

  public get value(): T {
    return this._value;
  }

  public get prevValue() {
    return this._prevValue;
  }

  public get hasChanged() {
    return this._comparator(this._prevValue, this._value) === false;
  }

  public constructor(
    initValue: T,
    private readonly _comparator: TrackedValueComparator<T> = TrackedValue.DEFAULT_COMPARATOR
  ) {
    this._value = initValue;
    this._prevValue = initValue;
  }

  public static ArrayUtils = class {
    public static someHasChanged(arr: TrackedValue<unknown>[]) {
      return arr.some((x) => x.hasChanged);
    }

    public static unbox<T extends TrackedValue<any>[]>(
      arr: T
    ): UnboxedTrackedArray<T> {
      return arr.map((x) => x.value) as UnboxedTrackedArray<T>;
    }
  };
}

export type TrackedArray<T extends Array<any>> = {
  [k in keyof T]: TrackedValue<T[k]>;
};

export type UnboxedTrackedArray<T extends TrackedValue<any>[]> = {
  [k in keyof T]: T[k] extends TrackedValue<infer R> ? R : never;
};
