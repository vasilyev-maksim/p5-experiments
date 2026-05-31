import { describe, expect, test } from "vitest";
import { Vector } from "./Vector";

describe("Vector", () => {
  test("add()", () => {
    const a = new Vector(1, 2);
    const b = a.add(new Vector(4, 8));
    expect(b).toEqual(new Vector(5, 10));
    expect(a, "stays untouched").toEqual(new Vector(1, 2));
  });

  test("sub()", () => {
    const a = new Vector(1, 2);
    const b = a.sub(new Vector(4, 8));
    expect(b).toEqual(new Vector(-3, -6));
    expect(a, "stays untouched").toEqual(new Vector(1, 2));
  });

  test("mag()", () => {
    expect(new Vector(4, 3).mag()).toBe(5);
  });

  test("normalize()", () => {
    const a = new Vector(5, 0);
    expect(a.normalize()).toEqual(new Vector(1, 0));
    expect(a, "stays untouched").toEqual(new Vector(5, 0));

    expect(new Vector(-5, 0).normalize()).toEqual(new Vector(-1, 0));
    expect(new Vector(0, 5).normalize()).toEqual(new Vector(0, 1));
    expect(new Vector(0, -5).normalize()).toEqual(new Vector(0, -1));
    expect(new Vector(4, 3).normalize()).toEqual(new Vector(0.8, 0.6));
  });

  test("heading()", () => {
    // Q1: both positive
    expect(new Vector(1, 1).heading()).toBeCloseTo(Math.PI / 4);
    // Q2: x negative, y positive
    expect(new Vector(-1, 1).heading()).toBeCloseTo((3 * Math.PI) / 4);
    // Q3: both negative
    expect(new Vector(-1, -1).heading()).toBeCloseTo((-3 * Math.PI) / 4);
    // Q4: x positive, y negative
    expect(new Vector(1, -1).heading()).toBeCloseTo(-Math.PI / 4);
    // axis-aligned
    expect(new Vector(1, 0).heading()).toBeCloseTo(0);
    expect(new Vector(0, 1).heading()).toBeCloseTo(Math.PI / 2);
    expect(new Vector(-1, 0).heading()).toBeCloseTo(Math.PI);
    expect(new Vector(0, -1).heading()).toBeCloseTo(-Math.PI / 2);
  });

  test("equals()", () => {
    expect(new Vector(4, 3).equals(new Vector(4, 3))).toBe(true);
    expect(new Vector(4, 3).equals(new Vector(3, 4))).toBe(false);
  });
});
