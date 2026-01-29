/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  TrackedArray,
  type ArrayOfTrackedValues,
  type TrackedArrayComparator,
} from "./TrackedArray";

export class MemoizedArray<
  ArgsType extends any[],
  ValueType,
> extends TrackedArray<ValueType> {
  public constructor(
    private readonly fn: (...args: ArgsType) => ValueType[],
    private readonly deps: ArrayOfTrackedValues<ArgsType>,
    comparator?: TrackedArrayComparator<ValueType>,
  ) {
    // Sometimes we need a reference to `MemoizedValue` instance
    // before it can actually be initialized with a real value,
    // that's why there is `undefined` provided as first arg
    super(undefined as any, comparator);
  }

  /** Calculates new value if some of args changed (or if `force` is true) */
  public recalc(force = false): this {
    this.value =
      force || TrackedArray.someHasChanged(this.deps)
        ? this.fn(...(TrackedArray.unbox(this.deps) as ArgsType))
        : this.value;

    return this;
  }
}
