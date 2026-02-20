/* eslint-disable @typescript-eslint/no-explicit-any */
import type { TrackedTuple, TrackedArrayComparator } from "./models";
import { TrackedArray } from "./TrackedArray";
import { TrackedDeps } from "./TrackedDeps";

export class MemoizedArray<
  ArgsType extends any[],
  ValueType,
> extends TrackedArray<ValueType> {
  private readonly deps;
  private readonly fn;

  public constructor({
    fn,
    deps,
    comparator,
  }: {
    fn: (...args: ArgsType) => ValueType[];
    deps: TrackedTuple<ArgsType>;
    comparator?: TrackedArrayComparator<ValueType>;
  }) {
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
