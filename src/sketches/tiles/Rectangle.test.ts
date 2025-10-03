import { Point } from "./Point";
import { Rectangle } from "./Rectangle";

describe("Rectangle", () => {
  test.each([
    [1, 1, 1, 1, [[1, 1]]],
    [
      1,
      1,
      2,
      2,
      [
        [1, 1],
        [1, 2],
        [2, 1],
        [2, 2],
      ],
    ],
    [
      2,
      2,
      1,
      1,
      [
        [1, 1],
        [1, 2],
        [2, 1],
        [2, 2],
      ],
    ],
    [
      1,
      2,
      2,
      1,
      [
        [1, 1],
        [1, 2],
        [2, 1],
        [2, 2],
      ],
    ],
    [
      2,
      3,
      5,
      6,
      [
        [2, 3],
        [2, 4],
        [2, 5],
        [2, 6],
        [3, 3],
        [3, 4],
        [3, 5],
        [3, 6],
        [4, 3],
        [4, 4],
        [4, 5],
        [4, 6],
        [5, 3],
        [5, 4],
        [5, 5],
        [5, 6],
      ],
    ],
  ])("getPointsRange (%i,%i,%i,%i)", (p1x, p1y, p2x, p2y, expected) => {
    const sut = new Rectangle(new Point(p1x, p1y), new Point(p2x, p2y));
    expect(sut.getPointsRange()).toEqual(
      expected.map(([x, y]) => new Point(x, y))
    );
  });
});
