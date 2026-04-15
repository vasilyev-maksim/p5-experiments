import type { Rectangle } from "@utils/Rectangle";
import { Vector } from "./Vector";
import { range } from "./misc";

type Matrix<T> = T[][];

export function inspectMatrix<T>(matrix: Matrix<T>) {
  const height = matrix.length;
  const width = matrix[0]?.length ?? 0;

  return {
    width,
    height,
  };
}

export function createMatrix<T>(
  rows: number,
  cols: number,
  elementInitializer: (rowIndex: number, colIndex: number) => T,
): Matrix<T> {
  return range(rows).map((_, rowIndex) =>
    range(cols).map((_, colIndex) => elementInitializer(rowIndex, colIndex)),
  );
}

export function mapMatrix<From, To>(
  matrix: Matrix<From>,
  mapper: (element: From, position: Vector) => To,
): Matrix<To> {
  return matrix.map((r, y) => r.map((c, x) => mapper(c, new Vector(x, y))));
}

export function mapMatrixRegion<T>(
  matrix: Matrix<T>,
  region: Rectangle,
  mapper: (element: T, position: Vector) => T,
): Matrix<T> {
  return mapMatrix(matrix, (el, pos) => {
    if (region.contains(pos)) {
      return mapper(el, pos);
    } else {
      return el;
    }
  });
}

export function layoutMatrix(matrix: Matrix<string>) {
  const { width, height } = inspectMatrix(matrix);
  if (height > 0 && width > 0) {
    return (
      "\n" +
      matrix.map((row) => "| " + row.join(" | ") + " |").join("\n") +
      "\n"
    );
  } else {
    return null;
  }
}

export function matrixFromPrint(print: string): Matrix<string> {
  const rows = print
    .split("\n")
    .map((x) => x.trim())
    .filter((x) => x.startsWith("|"));

  const matrix = rows.map((r) => {
    let cells = r.split("|");
    cells = cells
      .slice(1, cells.length - 1) // take all expect first and last elements
      .map((x) => x.slice(1, x.length - 1));
    return cells;
  });

  return matrix;
}

export function findInMatrix<T>(
  matrix: Matrix<T>,
  predicate: (value: T, x: number, y: number) => boolean,
): { value: T; position: Vector } | null {
  const { width, height } = inspectMatrix(matrix);

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const value = matrix[y][x];
      if (predicate(value, x, y)) {
        return {
          value,
          position: new Vector(x, y),
        };
      }
    }
  }

  return null;
}
