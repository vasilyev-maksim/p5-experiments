import type { TrackedArrayComparator } from "./models";
import { TrackedValue } from "./TrackedValue";

export class TrackedArray<T> extends TrackedValue<T[]> {
  public constructor(
    comparator: TrackedArrayComparator<T> = TrackedArray.defaultArrayComparator,
  ) {
    super(comparator);
  }

  public static defaultArrayComparator = <T>(a: T[] | undefined, b: T[]) => {
    if (a !== undefined) {
      if (a.length !== b.length) {
        return false;
      } else {
        return a.every((x, i) => x === b[i]);
      }
    } else {
      return false;
    }
  };
}
