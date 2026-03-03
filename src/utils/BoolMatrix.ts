import p5 from "p5";
import { Size } from "../sketches/tiles/Size";
import { range } from "./misc";

export interface IMatrix {
  get(cell: p5.Vector): boolean;
  set(cell: p5.Vector, value: boolean): void;
  getRandomTrue(): p5.Vector;
}

export class BoolMatrix implements IMatrix {
  private matrix: boolean[][];

  constructor(
    public readonly sizes: Size,
    public readonly randomProvider: () => number,
  ) {
    this.matrix = range(this.sizes.height).map(() =>
      Array(this.sizes.width).fill(true),
    );
  }

  public get(cell: p5.Vector) {
    return this.matrix[cell.y]?.[cell.x];
  }

  public set(cell: p5.Vector, value: boolean) {
    this.matrix[cell.y][cell.x] = value;
  }

  getAllWithValue(value: boolean): p5.Vector[] {
    const coords = [];
    for (let y = 0; y < this.matrix.length; y++) {
      for (let x = 0; x < this.matrix[y].length; x++) {
        const cell = new p5.Vector(x, y);
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
