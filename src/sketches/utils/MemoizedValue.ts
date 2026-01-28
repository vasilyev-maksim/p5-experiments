/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  TrackedValue,
  type TrackedArray,
  type TrackedValueComparator,
} from "./TrackedValue";

export class MemoizedValue<
  ArgsType extends any[],
  ValueType,
> extends TrackedValue<ValueType> {
  public constructor(
    private readonly fn: (...args: ArgsType) => ValueType,
    private readonly deps: TrackedArray<ArgsType>,
    comparator?: TrackedValueComparator<ValueType>,
  ) {
    const initialValue = fn(
      ...(TrackedValue.ArrayUtils.unbox(deps) as ArgsType),
    );
    super(initialValue, comparator);
  }

  /** Calculates new value if some of args changed */
  public recalc(): this {
    this.value = TrackedValue.ArrayUtils.someHasChanged(this.deps)
      ? this.fn(...(TrackedValue.ArrayUtils.unbox(this.deps) as ArgsType))
      : this.value;

    return this;
  }
}

// const m = new MemoizedValue((a: number, b: string) => {
//   console.log("computation");
//   return a + parseInt(b);
// });
// const a = new TrackedValue(1);
// const b = new TrackedValue("1");
// let t = m.getValue([a, b]);
// console.log(t.hasChanged, t.value);
// a.value = a.value!;
// b.value = b.value!;
// t = m.getValue([a, b]);
// console.log(t.hasChanged, t.value);
// a.value = a.value!;
// b.value = "2";
// t = m.getValue([a, b]);
// console.log(t.hasChanged, t.value);
