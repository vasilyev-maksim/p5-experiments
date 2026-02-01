/* eslint-disable @typescript-eslint/no-explicit-any */
import { TrackedValue } from "./TrackedValue";

export type TrackedArrayComparator<T> = (a?: T[], b?: T[]) => boolean;

export type ArrayOfTrackedValues<T extends Array<any>> = {
  [k in keyof T]: TrackedValue<T[k]>;
};

export type UnboxedArrayOfTrackedValues<T extends TrackedValue<any>[]> = {
  [k in keyof T]: T[k] extends TrackedValue<infer R> ? R : never;
};

export class TrackedArray<T> extends TrackedValue<T[]> {
  private static DEFAULT_ARRAY_COMPARATOR = <T>(a?: T[], b?: T[]) => {
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

  public constructor(
    initValue?: T[],
    comparator: TrackedArrayComparator<T> = TrackedArray.DEFAULT_ARRAY_COMPARATOR,
  ) {
    super(initValue, comparator);
  }

  public static someHasChanged(arr: TrackedValue<unknown>[]) {
    return arr.some((x) => x.hasChanged);
  }

  public static unbox<T extends TrackedValue<any>[]>(
    arr: T,
  ): UnboxedArrayOfTrackedValues<T> {
    return arr.map((x) => x.value) as UnboxedArrayOfTrackedValues<T>;
  }
}
