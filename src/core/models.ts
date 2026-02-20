/* eslint-disable @typescript-eslint/no-explicit-any */
import type { TrackedValue } from "./TrackedValue";

export type TrackedValueComparator<T> = (a?: T, b?: T) => boolean;
export type TrackedArrayComparator<T> = (a?: T[], b?: T[]) => boolean;

export type TrackedTuple<T extends any[]> = {
  [k in keyof T]: TrackedValue<T[k]>;
};

export interface IAnimatedValue<T> {
  getCurrentValue(currentTime: number): T | undefined;
}

export interface IValueProvider<T> {
  getValue(): T;
}

export interface ITrackedValueProvider<T> {
  getTrackedValue(): TrackedValue<T>;
}
