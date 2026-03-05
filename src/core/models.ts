/* eslint-disable @typescript-eslint/no-explicit-any */
import type { TrackedValue } from "./TrackedValue";

export type TrackedValueComparator<T> = (
  prev: T | undefined,
  next: T,
) => boolean;
export type TrackedArrayComparator<T> = (
  prev: T[] | undefined,
  next: T[],
) => boolean;

export type TrackedTuple<T extends any[]> = {
  [k in keyof T]: TrackedValue<T[k]>;
};

export interface IValueProvider<T> {
  getValue(): T;
}

export interface ITrackedValueProvider<T> {
  getTrackedValue(): TrackedValue<T>;
}

export type RandomProvider = () => number;

export type TimeProvider = () => number;
