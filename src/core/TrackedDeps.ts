/* eslint-disable @typescript-eslint/no-explicit-any */
import type { TrackedTuple } from "./models";
import { TrackedArray } from "./TrackedArray";
import { TrackedValue } from "./TrackedValue";

export class TrackedDeps<T extends any[]> extends TrackedValue<T> {
  public constructor(private readonly deps: TrackedTuple<T>) {
    const depsValues = TrackedArray.unboxTuple(deps);
    super(depsValues, TrackedArray.defaultArrayComparator);

    this.deps.forEach((dep) => {
      dep.onChanged.addCallback(() => {
        this.value = TrackedArray.unboxTuple(this.deps);
      });
    });
  }
}
