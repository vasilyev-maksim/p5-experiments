import type { TrackedArrayComparator, TrackedTuple } from "./models";
import { TrackedValue } from "./TrackedValue";

export class TrackedArray<T> extends TrackedValue<T[]> {
  public constructor(
    initValue: T[],
    comparator: TrackedArrayComparator<T> = TrackedArray.defaultArrayComparator,
  ) {
    super(initValue, comparator);
  }

  public static defaultArrayComparator = <T>(a?: T[], b?: T[]) => {
    if (a !== undefined && b !== undefined) {
      if (a.length !== b.length) {
        return false;
      } else {
        return a.every((x, i) => x === b[i]);
      }
    } else {
      return a === b;
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public static unboxTuple<T extends any[]>(arr: TrackedTuple<T> | T): T {
    return arr.map((x) => TrackedValue.unboxValue(x)) as T;
  }
}
