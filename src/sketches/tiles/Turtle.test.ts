import { describe, expect, test } from "vitest";
import { Tiler } from "./Turtle";
import { OccupancyGrid } from "@utils/OccupancyGrid";
import { Rectangle } from "@utils/Rectangle";
import { createRandomGenerator } from "@utils/misc";
import { Vector } from "@utils/Vector";
import {
  createMatrix,
  findInMatrix,
  layoutMatrix,
  mapMatrix,
  mapMatrixRegion,
  matrixFromPrint,
} from "@utils/matrix";

describe("Turtle", () => {
  describe("getEmptyPathLengthByDirection()", () => {
    test.each([
      {
        start: new Vector(0, 0),
        direction: new Vector(1, 0),
        occupied: [],
        expected: 9,
      },
      {
        start: new Vector(0, 0),
        direction: new Vector(0, 1),
        occupied: [],
        expected: 9,
      },
      {
        start: new Vector(0, 0),
        direction: new Vector(1, 1),
        occupied: [],
        expected: 9,
      },
      {
        start: new Vector(8, 8),
        direction: new Vector(1, 0),
        occupied: [],
        expected: 1,
      },
      {
        start: new Vector(8, 8),
        direction: new Vector(0, 1),
        occupied: [],
        expected: 1,
      },
      {
        start: new Vector(0, 0),
        direction: new Vector(-1, 0),
        occupied: [],
        expected: 0,
      },
      {
        start: new Vector(0, 0),
        direction: new Vector(0, -1),
        occupied: [],
        expected: 0,
      },
      {
        start: new Vector(0, 0),
        direction: new Vector(1, 0),
        occupied: [new Vector(5, 0)],
        expected: 4,
      },
      {
        start: new Vector(3, 3),
        direction: new Vector(0, -1),
        occupied: [new Vector(3, 2)],
        expected: 0,
      },
    ])(
      "for start = ($start.x, $start.y) and direction = ($direction.x, $direction.y): length = $expected",
      ({ start, direction, expected, occupied }) => {
        const og = new OccupancyGrid(10, 10, createRandomGenerator(1));
        occupied.forEach((x) => og.occupy(x));

        const sut = new Tiler(og, () => 1);

        expect(sut.getEmptyPathLengthByDirection(start, direction)).toBe(
          expected,
        );
      },
    );
  });

  test("getEndVariationsByDirection()", () => {
    const matrixPrint = `
        | X | X | X |   |   |
        | X |   |   |   |   |
        |   | X |   |   |   |
        |   |   |   |   |   |
        |   |   |   |   | S |
      `;
    const direction = new Vector(-1, -1);

    const strMatrix = matrixFromPrint(matrixPrint);
    const ogMatrix = mapMatrix(strMatrix, (x) => x === "X");
    const og = OccupancyGrid.fromMatrix(ogMatrix, () => 1);
    const { position: start } = findInMatrix(strMatrix, (x) => x === "S")!;
    const sut = new Tiler(og, () => 1);
    const ends = sut.getEndVariationsByDirection(start, direction);
    const prints = ends
      .map((end) =>
        mapMatrixRegion(strMatrix, new Rectangle(start, end), () => "."),
      )
      .map(layoutMatrix);

    expect(prints).toMatchInlineSnapshot(`
        [
          "
        | X | X | X |   |   |
        | X |   |   |   |   |
        |   | X |   |   |   |
        |   |   |   |   |   |
        |   |   |   |   | . |
        ",
          "
        | X | X | X |   |   |
        | X |   |   |   |   |
        |   | X |   |   |   |
        |   |   |   |   | . |
        |   |   |   |   | . |
        ",
          "
        | X | X | X |   |   |
        | X |   |   |   |   |
        |   | X |   |   | . |
        |   |   |   |   | . |
        |   |   |   |   | . |
        ",
          "
        | X | X | X |   |   |
        | X |   |   |   | . |
        |   | X |   |   | . |
        |   |   |   |   | . |
        |   |   |   |   | . |
        ",
          "
        | X | X | X |   | . |
        | X |   |   |   | . |
        |   | X |   |   | . |
        |   |   |   |   | . |
        |   |   |   |   | . |
        ",
          "
        | X | X | X |   |   |
        | X |   |   |   |   |
        |   | X |   |   |   |
        |   |   |   |   |   |
        |   |   |   | . | . |
        ",
          "
        | X | X | X |   |   |
        | X |   |   |   |   |
        |   | X |   |   |   |
        |   |   |   | . | . |
        |   |   |   | . | . |
        ",
          "
        | X | X | X |   |   |
        | X |   |   |   |   |
        |   | X |   | . | . |
        |   |   |   | . | . |
        |   |   |   | . | . |
        ",
          "
        | X | X | X |   |   |
        | X |   |   | . | . |
        |   | X |   | . | . |
        |   |   |   | . | . |
        |   |   |   | . | . |
        ",
          "
        | X | X | X | . | . |
        | X |   |   | . | . |
        |   | X |   | . | . |
        |   |   |   | . | . |
        |   |   |   | . | . |
        ",
          "
        | X | X | X |   |   |
        | X |   |   |   |   |
        |   | X |   |   |   |
        |   |   |   |   |   |
        |   |   | . | . | . |
        ",
          "
        | X | X | X |   |   |
        | X |   |   |   |   |
        |   | X |   |   |   |
        |   |   | . | . | . |
        |   |   | . | . | . |
        ",
          "
        | X | X | X |   |   |
        | X |   |   |   |   |
        |   | X | . | . | . |
        |   |   | . | . | . |
        |   |   | . | . | . |
        ",
          "
        | X | X | X |   |   |
        | X |   | . | . | . |
        |   | X | . | . | . |
        |   |   | . | . | . |
        |   |   | . | . | . |
        ",
          "
        | X | X | X |   |   |
        | X |   |   |   |   |
        |   | X |   |   |   |
        |   |   |   |   |   |
        |   | . | . | . | . |
        ",
          "
        | X | X | X |   |   |
        | X |   |   |   |   |
        |   | X |   |   |   |
        |   | . | . | . | . |
        |   | . | . | . | . |
        ",
          "
        | X | X | X |   |   |
        | X |   |   |   |   |
        |   | X |   |   |   |
        |   |   |   |   |   |
        | . | . | . | . | . |
        ",
          "
        | X | X | X |   |   |
        | X |   |   |   |   |
        |   | X |   |   |   |
        | . | . | . | . | . |
        | . | . | . | . | . |
        ",
        ]
      `);
  });

  test("getEndVariations()", () => {
    const matrixPrint = `
        | X | X | X |   |   |
        | X |   |   |   | X |
        |   |   | S |   |   |
        |   |   |   |   |   |
        |   |   | X |   |   |
      `;

    const strMatrix = matrixFromPrint(matrixPrint);
    const ogMatrix = mapMatrix(strMatrix, (x) => x === "X");
    const og = OccupancyGrid.fromMatrix(ogMatrix, () => 1);
    const { position: start } = findInMatrix(strMatrix, (x) => x === "S")!;
    const sut = new Tiler(og, () => 1);
    const ends = sut.getEndVariations(start);
    const prints = ends
      .map((end) =>
        mapMatrixRegion(strMatrix, new Rectangle(start, end), () => "."),
      )
      .map(layoutMatrix);

    expect(prints).toMatchInlineSnapshot(`
      [
        "
      | X | X | X |   |   |
      | X |   |   |   | X |
      |   |   | . |   |   |
      |   |   |   |   |   |
      |   |   | X |   |   |
      ",
        "
      | X | X | X |   |   |
      | X |   |   |   | X |
      |   |   | . |   |   |
      |   |   | . |   |   |
      |   |   | X |   |   |
      ",
        "
      | X | X | X |   |   |
      | X |   |   |   | X |
      |   |   | . | . |   |
      |   |   |   |   |   |
      |   |   | X |   |   |
      ",
        "
      | X | X | X |   |   |
      | X |   |   |   | X |
      |   |   | . | . |   |
      |   |   | . | . |   |
      |   |   | X |   |   |
      ",
        "
      | X | X | X |   |   |
      | X |   |   |   | X |
      |   |   | . | . | . |
      |   |   |   |   |   |
      |   |   | X |   |   |
      ",
        "
      | X | X | X |   |   |
      | X |   |   |   | X |
      |   |   | . | . | . |
      |   |   | . | . | . |
      |   |   | X |   |   |
      ",
        "
      | X | X | X |   |   |
      | X |   |   |   | X |
      |   | . | . |   |   |
      |   |   |   |   |   |
      |   |   | X |   |   |
      ",
        "
      | X | X | X |   |   |
      | X |   |   |   | X |
      |   | . | . |   |   |
      |   | . | . |   |   |
      |   |   | X |   |   |
      ",
        "
      | X | X | X |   |   |
      | X |   |   |   | X |
      | . | . | . |   |   |
      |   |   |   |   |   |
      |   |   | X |   |   |
      ",
        "
      | X | X | X |   |   |
      | X |   |   |   | X |
      | . | . | . |   |   |
      | . | . | . |   |   |
      |   |   | X |   |   |
      ",
        "
      | X | X | X |   |   |
      | X |   | . |   | X |
      |   |   | . |   |   |
      |   |   |   |   |   |
      |   |   | X |   |   |
      ",
        "
      | X | X | X |   |   |
      | X |   | . | . | X |
      |   |   | . | . |   |
      |   |   |   |   |   |
      |   |   | X |   |   |
      ",
        "
      | X | X | X |   |   |
      | X | . | . |   | X |
      |   | . | . |   |   |
      |   |   |   |   |   |
      |   |   | X |   |   |
      ",
      ]
    `);
  });

  describe("randomTiling()", () => {
    test("equal weights for all tiles", () => {
      const og = new OccupancyGrid(10, 10, createRandomGenerator(23233));
      const sut = new Tiler(og, () => 1);

      const tiles = sut.randomTiling();
      expect(layoutTiles(tiles, 10, 10)).toMatchInlineSnapshot(`
        "
        | 88 | 14 | 38 | 12 | 6  | 75 | 34 | 59 | 24 | 43 |
        | 66 | 50 | 87 | 53 | 77 | 42 | 90 | 81 | 25 | 98 |
        | 83 | 51 | 39 | 92 | 23 | 79 | 68 | 47 | 44 | 82 |
        | 9  | 67 | 29 | 35 | 32 | 18 | 33 | 91 | 62 | 93 |
        | 57 | 73 | 48 | 63 | 95 | 8  | 27 | 55 | 60 | 71 |
        | 2  | 13 | 70 | 22 | 15 | 31 | 86 | 11 | 65 | 80 |
        | 7  | 49 | 16 | 1  | 19 | 36 | 74 | 3  | 64 | 54 |
        | 96 | 89 | 37 | 61 | 20 | 52 | 85 | 78 | 0  | 40 |
        | 26 | 84 | 58 | 28 | 21 | 99 | 17 | 69 | 10 | 41 |
        | 72 | 94 | 97 | 76 | 5  | 4  | 46 | 30 | 56 | 45 |
        "
      `);
    });

    test("constrained by area", () => {
      const og = new OccupancyGrid(10, 10, createRandomGenerator(12));
      const sut = new Tiler(og, (tile) => tile.getArea());

      const tiles = sut.randomTiling();

      expect(layoutTiles(tiles, 10, 10)).toMatchInlineSnapshot(`
        "
        | 4  | 4  | 1  | 1  | 1  | 1  | 1  | 1  | 1  | 1  |
        | 4  | 4  | 1  | 1  | 1  | 1  | 1  | 1  | 1  | 1  |
        | 0  | 0  | 0  | 0  | 0  | 0  | 0  | 0  | 0  | 3  |
        | 0  | 0  | 0  | 0  | 0  | 0  | 0  | 0  | 0  | 3  |
        | 0  | 0  | 0  | 0  | 0  | 0  | 0  | 0  | 0  | 2  |
        | 0  | 0  | 0  | 0  | 0  | 0  | 0  | 0  | 0  | 2  |
        | 0  | 0  | 0  | 0  | 0  | 0  | 0  | 0  | 0  | 2  |
        | 0  | 0  | 0  | 0  | 0  | 0  | 0  | 0  | 0  | 2  |
        | 0  | 0  | 0  | 0  | 0  | 0  | 0  | 0  | 0  | 2  |
        | 0  | 0  | 0  | 0  | 0  | 0  | 0  | 0  | 0  | 2  |
        "
      `);
    });

    test("constrained by aspect ratio", () => {
      const og = new OccupancyGrid(10, 10, createRandomGenerator(114));
      const sut = new Tiler(og, (tile) => {
        const area = tile.getArea();
        const aspectRatio = tile.getAspectRatio();
        return aspectRatio === 1 ? area : 0;
      });

      const tiles = sut.randomTiling();

      expect(layoutTiles(tiles, 10, 10)).toMatchInlineSnapshot(`
        "
        | 14 | 1  | 1  | 1  | 1  | 19 | 4  | 4  | 4  | 9  |
        | 20 | 1  | 1  | 1  | 1  | 18 | 4  | 4  | 4  | 16 |
        | 25 | 1  | 1  | 1  | 1  | 15 | 4  | 4  | 4  | 10 |
        | 12 | 1  | 1  | 1  | 1  | 5  | 13 | 8  | 24 | 23 |
        | 3  | 3  | 3  | 22 | 0  | 0  | 0  | 0  | 0  | 0  |
        | 3  | 3  | 3  | 17 | 0  | 0  | 0  | 0  | 0  | 0  |
        | 3  | 3  | 3  | 6  | 0  | 0  | 0  | 0  | 0  | 0  |
        | 21 | 2  | 2  | 2  | 0  | 0  | 0  | 0  | 0  | 0  |
        | 11 | 2  | 2  | 2  | 0  | 0  | 0  | 0  | 0  | 0  |
        | 7  | 2  | 2  | 2  | 0  | 0  | 0  | 0  | 0  | 0  |
        "
      `);
    });
  });

  test("1 cell wide only", () => {
    const og = new OccupancyGrid(10, 10, createRandomGenerator(444));
    const sut = new Tiler(og, (tile) => {
      const area = tile.getArea();
      return tile.width === 1 || tile.height === 1 ? area : 0;
    });

    const tiles = sut.randomTiling();

    expect(layoutTiles(tiles, 10, 10)).toMatchInlineSnapshot(`
      "
      | 17 | 6  | 3  | 3  | 3  | 3  | 3  | 2  | 10 | 1  |
      | 17 | 6  | 21 | 8  | 13 | 19 | 4  | 2  | 10 | 1  |
      | 17 | 6  | 0  | 8  | 13 | 12 | 4  | 2  | 10 | 1  |
      | 17 | 6  | 0  | 8  | 13 | 12 | 4  | 2  | 10 | 1  |
      | 5  | 6  | 0  | 8  | 13 | 12 | 4  | 2  | 10 | 1  |
      | 5  | 6  | 0  | 8  | 7  | 9  | 4  | 2  | 10 | 1  |
      | 5  | 6  | 0  | 8  | 7  | 9  | 4  | 2  | 10 | 1  |
      | 5  | 16 | 0  | 8  | 7  | 9  | 4  | 20 | 10 | 1  |
      | 5  | 15 | 0  | 8  | 7  | 9  | 4  | 14 | 14 | 1  |
      | 5  | 15 | 0  | 18 | 7  | 9  | 4  | 11 | 11 | 1  |
      "
    `);
  });
});

export function layoutTiles(tiles: Rectangle[], width: number, height: number) {
  const matrix = createMatrix(height, width, () => "  ");

  tiles.forEach((tile, i) => {
    tile
      .getPointsRange()
      .forEach((p) => (matrix[p.y][p.x] = i.toString().padEnd(2, " ")));
  });

  return layoutMatrix(matrix);
}
