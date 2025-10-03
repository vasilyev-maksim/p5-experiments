import { Matrix } from "./Matrix";
import { Point } from "./Point";
import { Rectangle } from "./Rectangle";
import { Size } from "./Size";
import { Turtle } from "./Turtle";
import { Vector } from "./Vector";

describe("Turtle", () => {
  test.each([
    { originX: 1, originY: 1, directionX: 1, directionY: 0, expected: 4 },
    { originX: 1, originY: 1, directionX: 0, directionY: 1, expected: 4 },
    { originX: 2, originY: 2, directionX: 1, directionY: 0, expected: 3 },
    { originX: 2, originY: 2, directionX: 0, directionY: 1, expected: 3 },

    { originX: 1, originY: 4, directionX: 0, directionY: 1, expected: 1 },
    { originX: 4, originY: 1, directionX: 1, directionY: 0, expected: 1 },

    { originX: 4, originY: 2, directionX: 1, directionY: 0, expected: 1 },
    { originX: 4, originY: 2, directionX: 0, directionY: 1, expected: 3 },
    { originX: 4, originY: 2, directionX: -1, directionY: 0, expected: 3 },
    { originX: 4, originY: 2, directionX: 0, directionY: -1, expected: 1 },

    { originX: 5, originY: 5, directionX: -1, directionY: 0, expected: 4 },
    { originX: 5, originY: 5, directionX: 0, directionY: -1, expected: 4 },

    { originX: 5, originY: 5, directionX: 0, directionY: 1, expected: 0 },
    { originX: 5, originY: 5, directionX: 1, directionY: 0, expected: 0 },
    { originX: 6, originY: 6, directionX: 0, directionY: 1, expected: 0 },
    { originX: 1, originY: 1, directionX: 0, directionY: -1, expected: 0 },
  ])(
    "getEmptyPathLengthByDirection (oX = $originX, oY = $originY, dX = $directionX, dY = $directionY) = $expected",
    ({ originX, originY, directionX, directionY, expected }) => {
      const matrix = new Matrix(new Size(5, 5));

      const sut = new Turtle(new Point(originX, originY), {
        isForwardPossible: (cell) => {
          return matrix.get(cell);
        },
        onCommit: () => {},
        rectEvaluator: () => 1,
      });

      expect(
        sut.getEmptyPathLengthByDirection(new Vector(directionX, directionY))
      ).toBe(expected);
    }
  );

  test.each([
    {
      fieldSize: new Size(4, 4),
      originX: 1,
      originY: 1,
      occupied: [
        [4, 2],
        [4, 3],
        [3, 3],
        [3, 4],
      ],
      expected: [
        [2, 4],
        [3, 2],
        [4, 1],
      ],
    },
    {
      fieldSize: new Size(4, 4),
      originX: 1,
      originY: 1,
      occupied: [
        [4, 2],
        [4, 3],
        [3, 3],
        [3, 4],
        [1, 2],
      ],
      expected: [[4, 1]],
    },
    {
      fieldSize: new Size(4, 4),
      originX: 2,
      originY: 2,
      occupied: [
        [4, 2],
        [4, 3],
        [3, 3],
        [3, 4],
      ],
      expected: [
        [2, 4],
        [3, 2],
      ],
    },
    {
      fieldSize: new Size(4, 4),
      originX: 1,
      originY: 1,
      occupied: [
        [4, 1],
        [3, 2],
        [2, 3],
        [1, 4],
      ],
      expected: [
        [1, 3],
        [2, 2],
        [3, 1],
      ],
    },
    {
      fieldSize: new Size(5, 5),
      originX: 1,
      originY: 1,
      occupied: [],
      expected: [[5, 5]],
    },
  ])(
    "getRectangleVariations (oX = $originX, oY = $originY, dX = $directionX, dY = $directionY)",
    ({ originX, originY, expected, occupied, fieldSize }) => {
      const matrix = new Matrix(fieldSize);
      occupied.forEach(([x, y]) => {
        matrix.set(new Point(x, y), false);
      });

      const origin = new Point(originX, originY);
      const sut = new Turtle(origin, {
        isForwardPossible: (cell) => {
          return !!matrix.get(cell);
        },
        onCommit: () => {},
        rectEvaluator: () => 1,
      });

      const expectedRects = expected.map(
        ([x, y]) => new Rectangle(new Point(x, y), origin)
      );
      const result = sut.getRectangleVariations();
      expect(result).toEqual(expectedRects);
    }
  );
});
