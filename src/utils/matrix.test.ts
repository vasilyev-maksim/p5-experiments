import {
  createMatrix,
  findInMatrix,
  inspectMatrix,
  layoutMatrix,
  mapMatrix,
  mapMatrixRegion,
  matrixFromPrint,
} from "./matrix";
import { expect, describe, test } from "vitest";
import { Vector } from "./Vector";
import { Rectangle } from "./Rectangle";

describe("matrix utils", () => {
  test("inspectMatrix", () => {
    expect(
      inspectMatrix([
        ["1", "2", "3"],
        ["4", "5", "6"],
      ]),
    ).toEqual({
      width: 3,
      height: 2
    });

    expect(inspectMatrix([])).toEqual({
      width: 0,
      height: 0,
    });
  });

  test("createMatrix", () => {
    expect(createMatrix(5, 5, (r, c) => `R${r} C${c}`)).toEqual([
      ["R0 C0", "R0 C1", "R0 C2", "R0 C3", "R0 C4"],
      ["R1 C0", "R1 C1", "R1 C2", "R1 C3", "R1 C4"],
      ["R2 C0", "R2 C1", "R2 C2", "R2 C3", "R2 C4"],
      ["R3 C0", "R3 C1", "R3 C2", "R3 C3", "R3 C4"],
      ["R4 C0", "R4 C1", "R4 C2", "R4 C3", "R4 C4"],
    ]);

    expect(createMatrix(0, 0, () => 1)).toEqual([]);
  });

  test("mapMatrix", () => {
    expect(
      mapMatrix(
        [
          ["1", "2", "3"],
          ["4", "5", "6"],
          ["7", "8", "9"],
        ],
        (x, pos) => `${x} ${pos.x} ${pos.y}`,
      ),
    ).toEqual([
      ['1 0 0', '2 1 0', '3 2 0'],
      ['4 0 1', '5 1 1', '6 2 1'],
      ['7 0 2', '8 1 2', '9 2 2'],
    ]);
  });

  test("mapMatrixRegion", () => {
    expect(
      mapMatrixRegion(
        [
          ["1", "2", "3", "4"],
          ["5", "6", "7", "8"],
          ["9", "10", "11", "12"],
          ["13", "14", "15", "16"],
        ],
        new Rectangle(new Vector(1,1), new Vector(2,2)),
        (x, pos) => `${x} ${pos.x} ${pos.y}`,
      ),
    ).toEqual([
      ["1", "2", "3", "4"],
      ["5", "6 1 1", "7 2 1", "8"],
      ["9", "10 1 2", "11 2 2", "12"],
      ["13", "14", "15", "16"],
    ]);
  });

  test("layoutMatrix", () => {
    expect(
      layoutMatrix([
        ["1", "2", "3"],
        ["4", "5", "6"],
        ["7", "8", "9"],
      ]),
    ).toMatchInlineSnapshot(`
      "
      | 1 | 2 | 3 |
      | 4 | 5 | 6 |
      | 7 | 8 | 9 |
      "
    `);

    expect(layoutMatrix([])).toBe(null);
  });

  test("matrixFromPrint", () => {
    expect(
      matrixFromPrint(`
        | 1 | 2 | 3 |
        | 4 | 5 | 6 |
        | 7 | 8 | 9 |
      `),
    ).toEqual([
      ["1", "2", "3"],
      ["4", "5", "6"],
      ["7", "8", "9"],
    ]);
  });

  test("findInMatrix", () => {
    expect(
      findInMatrix([
        ["1", "2", "3"],
        ["4", "5", "6"],
      ], x => x === '5'),
    ).toEqual({
      value: '5',
      position: new Vector(1,1)
    });

    expect(findInMatrix([], x => x === 1)).toEqual(null);
  });
});
