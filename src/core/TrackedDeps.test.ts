import { expect, test, vi } from "vitest";
import { TrackedDeps } from "./TrackedDeps";
import { TrackedValue } from "./TrackedValue";

test("TrackedDeps", () => {
  const cb = vi.fn();
  const a = new TrackedValue(1);
  const b = new TrackedValue(2);
  const sut = new TrackedDeps([a, b]);
  sut.onChanged.addCallback(cb);

  expect(
    cb,
    "doesn't call `onChange` callback during initialization",
  ).not.toHaveBeenCalled();
  expect(sut.value).toEqual([1, 2]);
  expect(sut.prevValue).toEqual(undefined);

  a.value = 3;

  expect(
    cb,
    "calls `onChange` callback for the first time passing array with new item",
  ).toHaveBeenCalledTimes(1);
  expect(
    cb,
    "calls `onChange` callback passing new array",
  ).toHaveBeenLastCalledWith([3, 2]);
  expect(sut.value, "`value` is correct").toEqual([3, 2]);
  expect(sut.prevValue).toEqual([1, 2]);

  b.value = 4;

  expect(
    cb,
    "calls `onChange` callback passing array with new item",
  ).toHaveBeenCalledTimes(2);
  expect(
    cb,
    "calls `onChange` callback passing array with new item",
  ).toHaveBeenLastCalledWith([3, 4]);
  expect(sut.value, "`value` is correct").toEqual([3, 4]);
  expect(sut.prevValue).toEqual([3, 2]);

  b.value = 4;

  expect(
    cb,
    "doesn't call `onChange` callback for the same array",
  ).toHaveBeenCalledTimes(2);
  expect(sut.value, "`value` remains the same").toEqual([3, 4]);
  expect(sut.prevValue).toEqual([3, 2]);

  sut.value = [10, 11];

  expect(
    cb,
    "calls `onChange` callback with array directly set as `sut.value`",
  ).toHaveBeenCalledTimes(3);
  expect(
    cb,
    "calls `onChange` callback passing new array",
  ).toHaveBeenLastCalledWith([10, 11]);
  expect(sut.value, "`value` is correct").toEqual([10, 11]);
  expect(sut.prevValue).toEqual([3, 4]);

  sut.value = [10, 11];

  expect(
    cb,
    "doesn't call `onChange` callback for the same array set directly as `sut.value`",
  ).toHaveBeenCalledTimes(3);
  expect(sut.value, "`value` remains the same").toEqual([10, 11]);
  expect(sut.prevValue).toEqual([3, 4]);
});
