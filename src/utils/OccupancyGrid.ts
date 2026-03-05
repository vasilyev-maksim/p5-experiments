import p5 from "p5";
import { Size } from "../sketches/tiles/Size";
import { range } from "./misc";
import type { RandomProvider } from "@/core/models";

export class OccupancyGrid {
  private matrix: boolean[][];
  private freeCellsCount: number;

  constructor(
    public readonly sizes: Size,
    public readonly randomProvider: RandomProvider,
  ) {
    this.matrix = range(this.sizes.height).map(() =>
      Array(this.sizes.width).fill(false),
    );
    this.freeCellsCount = this.sizes.getArea();
  }

  public isOccupied(cell: p5.Vector) {
    return this.matrix[cell.y]?.[cell.x] ?? true;
  }

  public occupy(cell: p5.Vector) {
    this.matrix[cell.y][cell.x] = true;
    this.freeCellsCount--;
  }

  public getRandomFreeCell(): p5.Vector | undefined {
    const randomIndex = Math.floor(this.freeCellsCount * this.randomProvider());
    let i = -1;

    for (let y = 0; y < this.matrix.length; y++) {
      for (let x = 0; x < this.matrix[y].length; x++) {
        if (this.matrix[y][x] === false) {
          i++;
          if (i === randomIndex) {
            return new p5.Vector(x, y);
          }
        }
      }
    }
  }

  public isFullyOccupied() {
    return this.freeCellsCount === 0;
  }
}
