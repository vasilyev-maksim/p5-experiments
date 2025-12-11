import p5 from "p5";
import { Size } from "./Size";

export interface IMatrix {
  get(cell: p5.Vector): boolean;
  set(cell: p5.Vector, value: boolean): void;
  getRandomTrue(): p5.Vector;
}

// 1-based matrix (not 0-based as usual arrays)
export class Matrix implements IMatrix {
  private matrix: boolean[][];

  constructor(
    public readonly sizes: Size,
    public readonly randomProvider: () => number
  ) {
    this.matrix = Array.from({ length: this.sizes.height }, () =>
      Array(this.sizes.width).fill(true)
    );
  }

  public get(cell: p5.Vector) {
    return this.matrix[cell.y - 1]?.[cell.x - 1];
  }

  public set(cell: p5.Vector, value: boolean) {
    this.matrix[cell.y - 1][cell.x - 1] = value;
  }

  getAllWithValue(value: boolean): p5.Vector[] {
    const coords = [];
    for (let y = 0; y < this.matrix.length; y++) {
      for (let x = 0; x < this.matrix[y].length; x++) {
        const cell = new p5.Vector(x + 1, y + 1);
        if (this.get(cell) === value) {
          coords.push(cell);
        }
      }
    }
    return coords;
  }

  public getRandomTrue() {
    const options = this.getAllWithValue(true);
    return options[Math.floor(this.randomProvider() * options.length)];
  }
}
