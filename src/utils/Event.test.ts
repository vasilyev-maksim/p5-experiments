import { describe, expect, test, vi } from "vitest";
import { Event } from "./Event";

describe("Event", () => {
  test("calls single listener", () => {
    const cb = vi.fn();
    const sut = new Event<number>();

    sut.addListener(cb);

    sut.dispatch(1);

    expect(cb).toBeCalledTimes(1);
    expect(cb).toBeCalledWith(1);
  });

  test("calls multiple listeners in the right order", () => {
    const arr: number[] = [];
    const push = (val: number) => () => arr.push(val);
    const sut = new Event<number>();

    sut.addListener(push(1));
    sut.addListener(push(2));
    sut.addListener(push(3));

    sut.dispatch(1);

    expect(arr).toEqual([1, 2, 3]);
  });

  test("covers the scenario when listener adds another listener during invocation", () => {
    const arr: number[] = [];
    const push = (val: number) => () => arr.push(val);
    const sut = new Event();

    sut.addListener(push(1));
    sut.addListener(push(2));
    sut.addListener(() => {
      push(3)();
      sut.addListener(push(6));
      sut.addListener(() => {
        push(7)();
        sut.addListener(push(8));
      });
    });
    sut.addListener(push(4));
    sut.addListener(push(5));

    sut.dispatch();

    expect(arr).toEqual([1, 2, 3, 4, 5, 6, 7, 8]);
  });

  test("listeners override using `id` arg", () => {
    const cb = vi.fn();
    const cb2 = vi.fn();
    const sut = new Event<number>();

    sut.addListener(cb, "id");
    sut.addListener(cb2, "id"); // overrides line above

    sut.dispatch(1);

    expect(cb).not.toBeCalled();
    expect(cb2).toHaveBeenCalledExactlyOnceWith(1);
  });

  describe("listener removal", () => {
    test("by callback ref", () => {
      const cb = vi.fn();
      const cb2 = vi.fn();
      const sut = new Event<number>();

      sut.addListener(cb);
      sut.addListener(cb);
      sut.addListener(cb2);

      sut.removeListener(cb);
      sut.dispatch(1);

      expect(cb).not.toBeCalled();
      expect(cb2).toHaveBeenCalledExactlyOnceWith(1);
    });

    test("by id", () => {
      const cb = vi.fn();
      const cb2 = vi.fn();
      const sut = new Event<number>();

      sut.addListener(cb, "first");
      sut.addListener(cb2, "first");
      sut.addListener(cb2, "second");

      sut.removeListener("first");
      sut.dispatch(1);

      expect(cb).not.toBeCalled();
      expect(cb2).toHaveBeenCalledExactlyOnceWith(1);
    });
  });
});
