/* eslint-disable @typescript-eslint/no-explicit-any */
import type { TrackedTuple, TrackedValueComparator } from "./models";
import { TrackedValue } from "./TrackedValue";

export type MemoizedValueParams<ArgsType extends any[], ValueType> = {
  fn: (...args: ArgsType) => ValueType;
  deps: TrackedTuple<ArgsType>;
  comparator?: TrackedValueComparator<ValueType>;
};

export class MemoizedValue<
  ArgsType extends any[],
  ValueType,
> extends TrackedValue<ValueType> {
  private readonly deps: TrackedTuple<ArgsType>;
  private readonly fn;

  public constructor({
    fn,
    deps,
    comparator,
  }: MemoizedValueParams<ArgsType, ValueType>) {
    super(comparator);

    this.fn = fn;
    this.deps = deps;
  }

  public recalc() {
    const someDepChanged = this.deps.some((x) => x.hasChanged());
    if (someDepChanged) {
      const args = this.deps.map((x) => x.getValue()) as ArgsType;
      const newValue = this.fn(...args);

      this.setValue(newValue);
    }
  }
}
