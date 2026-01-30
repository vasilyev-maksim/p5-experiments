/* eslint-disable @typescript-eslint/no-explicit-any */
import { TrackedArray, type ArrayOfTrackedValues } from "./TrackedArray";
import { TrackedValue, type TrackedValueComparator } from "./TrackedValue";

export class MemoizedValue<
  ArgsType extends any[],
  ValueType,
> extends TrackedValue<ValueType> {
  public constructor(
    private readonly fn: (...args: ArgsType) => ValueType,
    private readonly deps: ArrayOfTrackedValues<ArgsType>,
    comparator?: TrackedValueComparator<ValueType>,
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
