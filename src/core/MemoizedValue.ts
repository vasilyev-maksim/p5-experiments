/* eslint-disable @typescript-eslint/no-explicit-any */
import type { TrackedTuple, TrackedValueComparator } from "./models";
import { TrackedDeps } from "./TrackedDeps";
import { TrackedValue } from "./TrackedValue";

export class MemoizedValue<
  ArgsType extends any[],
  ValueType,
> extends TrackedValue<ValueType> {
  private readonly deps: TrackedDeps<ArgsType>;
  
  public constructor(
    private readonly fn: (...args: ArgsType) => ValueType,
    deps: TrackedTuple<ArgsType>,
    comparator?: TrackedValueComparator<ValueType>,
  ) {
    const trackedDeps = new TrackedDeps(deps);
    const initValue = fn(...trackedDeps.value);

    super(initValue, comparator);

    this.deps = trackedDeps;
    this.deps.onChanged.addCallback((args) => {
      this.value = this.fn(...args);
    });
  }
}
