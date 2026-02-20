/* eslint-disable @typescript-eslint/no-explicit-any */
import type { TrackedTuple, TrackedValueComparator } from "./models";
import { TrackedDeps } from "./TrackedDeps";
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
  private readonly deps: TrackedDeps<ArgsType>;
  private readonly fn;

  public constructor({
    fn,
    deps,
    comparator,
  }: MemoizedValueParams<ArgsType, ValueType>) {
    const trackedDeps = new TrackedDeps(deps);
    const initValue = fn(...trackedDeps.value);

    super(initValue, comparator);

    this.fn = fn;
    this.deps = trackedDeps;
    this.deps.onChanged.addCallback((args) => {
      this.value = this.fn(...args);
    });
  }
}
