import { describe, expect, test } from "vitest";
import { OccupancyGrid } from "./OccupancyGrid";
import { Vector } from "@utils/Vector";
import { assert } from "./misc";
import { layoutMatrix, mapMatrix } from "./matrix";

describe("OccupancyGrid", () => {
  test("initially fully vacant", () => {
    const sut = new OccupancyGrid(5, 5, () => Math.random());

    expect(layoutOccupancyGrid(sut)).toMatchInlineSnapshot(`
      "
      |   |   |   |   |   |
      |   |   |   |   |   |
      |   |   |   |   |   |
      |   |   |   |   |   |
      |   |   |   |   |   |
      "
    `);
    expect(sut.getFreeCellsCount()).toBe(25);
  });

  test("occupy single cell", () => {
    const sut = new OccupancyGrid(5, 5, () => Math.random());
    sut.occupy(new Vector(0, 0));

    expect(layoutOccupancyGrid(sut)).toMatchInlineSnapshot(`
      "
      | X |   |   |   |   |
      |   |   |   |   |   |
      |   |   |   |   |   |
      |   |   |   |   |   |
      |   |   |   |   |   |
      "
    `);
    expect(sut.getFreeCellsCount()).toBe(24);
  });

  test("occupy all one by one using `getRandomFreeCell()`", () => {
    const sut = new OccupancyGrid(5, 5, () => Math.random());

    expect(sut.isFullyOccupied()).toBe(false);

    while (!sut.isFullyOccupied()) {
      const cell = sut.getRandomFreeCell();
      expect(cell !== undefined).toBe(true);
      assert(cell !== undefined);
      expect(sut.isOccupied(cell)).toBe(false);
      sut.occupy(cell);
      expect(sut.isOccupied(cell)).toBe(true);
    }

    expect(sut.isFullyOccupied()).toBe(true);
    expect(sut.getFreeCellsCount()).toBe(0);
    expect(sut.getRandomFreeCell() === undefined).toBe(true);
  });

  describe("range", () => {
    test("1x5", () => {
      const sut = new OccupancyGrid(5, 5, () => Math.random());
      sut.occupyRange(new Vector(0, 0), new Vector(0, 4));

      expect(layoutOccupancyGrid(sut)).toMatchInlineSnapshot(`
        "
        | X |   |   |   |   |
        | X |   |   |   |   |
        | X |   |   |   |   |
        | X |   |   |   |   |
        | X |   |   |   |   |
        "
      `);
      expect(sut.getFreeCellsCount()).toBe(20);
    });

    test("5x1", () => {
      const sut = new OccupancyGrid(5, 5, () => Math.random());
      sut.occupyRange(new Vector(4, 4), new Vector(4, 0));

      expect(layoutOccupancyGrid(sut)).toMatchInlineSnapshot(`
        "
        |   |   |   |   | X |
        |   |   |   |   | X |
        |   |   |   |   | X |
        |   |   |   |   | X |
        |   |   |   |   | X |
        "
      `);
      expect(sut.getFreeCellsCount()).toBe(20);
    });

    test("2x3", () => {
      const sut = new OccupancyGrid(5, 5, () => Math.random());
      sut.occupyRange(new Vector(0, 0), new Vector(2, 3));

      expect(layoutOccupancyGrid(sut)).toMatchInlineSnapshot(`
        "
        | X | X | X |   |   |
        | X | X | X |   |   |
        | X | X | X |   |   |
        | X | X | X |   |   |
        |   |   |   |   |   |
        "
      `);
      expect(sut.getFreeCellsCount()).toBe(13);
    });

    test("5x5", () => {
      const sut = new OccupancyGrid(5, 5, () => Math.random());
      sut.occupyRange(new Vector(0, 0), new Vector(4, 4));

      expect(layoutOccupancyGrid(sut)).toMatchInlineSnapshot(`
        "
        | X | X | X | X | X |
        | X | X | X | X | X |
        | X | X | X | X | X |
        | X | X | X | X | X |
        | X | X | X | X | X |
        "
      `);
      expect(sut.getFreeCellsCount()).toBe(0);
      expect(sut.isFullyOccupied()).toBe(true);
    });

    test("3x3", () => {
      const sut = new OccupancyGrid(5, 5, () => Math.random());
      sut.occupyRange(new Vector(1, 1), new Vector(3, 3));

      expect(layoutOccupancyGrid(sut)).toMatchInlineSnapshot(`
        "
        |   |   |   |   |   |
        |   | X | X | X |   |
        |   | X | X | X |   |
        |   | X | X | X |   |
        |   |   |   |   |   |
        "
      `);
      expect(sut.getFreeCellsCount()).toBe(16);
    });
  });
});

export function layoutOccupancyGrid(og: OccupancyGrid) {
  return layoutMatrix(mapMatrix(og.grid, (x) => (x ? "X" : " ")));
}
