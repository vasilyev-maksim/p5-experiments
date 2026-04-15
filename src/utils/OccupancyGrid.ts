import type { RandomProvider } from "@/core/models";
import { Vector } from "@utils/Vector";
import { Rectangle } from "@utils/Rectangle";
import { createMatrix } from "./matrix";

export class OccupancyGrid {
  public grid: boolean[][];
  private freeCellsCount: number;

  constructor(
    public readonly width: number,
    public readonly height: number,
    public readonly randomProvider: RandomProvider,
  ) {
    this.grid = createMatrix(this.height, this.width, () => false);
    this.freeCellsCount = this.width * this.height;
  }

  public isOccupied(cell: Vector) {
    return this.grid[cell.y]?.[cell.x] ?? true;
  }

  public occupy(cell: Vector) {
    if (this.grid[cell.y]) {
      this.grid[cell.y][cell.x] = true;
      this.freeCellsCount--;
    }
  }

  public occupyRange(start: Vector, end: Vector) {
    const rect = new Rectangle(start, end);
    rect.getPointsRange().forEach((cell) => this.occupy(cell));
  }

  public getRandomFreeCell(): Vector | undefined {
    const randomIndex = Math.floor(this.freeCellsCount * this.randomProvider());
    let i = -1;

    for (let y = 0; y < this.grid.length; y++) {
      for (let x = 0; x < this.grid[y].length; x++) {
        if (this.grid[y][x] === false) {
          i++;
          if (i === randomIndex) {
            return new Vector(x, y);
          }
        }
      }
    }
  }

  public isFullyOccupied() {
    return this.freeCellsCount === 0;
  }

  public getFreeCellsCount() {
    return this.freeCellsCount;
  }

  public static fromMatrix(
    matrix: boolean[][],
    randomProvider: RandomProvider,
  ): OccupancyGrid {
    const height = matrix.length;
    const width = matrix[0]?.length ?? 0;
    const og = new OccupancyGrid(width, height, randomProvider);
    matrix.forEach((r, y) => {
      r.forEach((c, x) => {
        if (c) {
          og.occupy(new Vector(x, y));
        }
      });
    });
    return og;
  }
}
