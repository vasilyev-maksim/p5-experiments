import { Vector } from "./Vector";
import { type ISize, Size } from "../sketches/tiles/Size";

export interface IRectangle extends ISize {
  topLeft: Vector;
  bottomRight: Vector;
  center: Vector;
  width: number;
  height: number;
  getPointsRange: () => Vector[];
  scale: (factor: number) => IRectangle;
}

export class Rectangle extends Size implements IRectangle {
  public topLeft: Vector;
  public bottomRight: Vector;
  public center: Vector;

  constructor(p1: Vector, p2: Vector = p1) {
    const topLeft = new Vector(Math.min(p1.x, p2.x), Math.min(p1.y, p2.y));
    const bottomRight = new Vector(Math.max(p1.x, p2.x), Math.max(p1.y, p2.y));

    const width = bottomRight.x - topLeft.x + 1;
    const height = bottomRight.y - topLeft.y + 1;

    super(width, height);

    this.bottomRight = bottomRight;
    this.topLeft = topLeft;
    this.center = this.topLeft.add(new Vector(width / 2, height / 2));
  }

  public getPointsRange() {
    const points = [];
    for (let x = this.topLeft.x; x <= this.bottomRight.x; x++) {
      for (let y = this.topLeft.y; y <= this.bottomRight.y; y++) {
        points.push(new Vector(x, y));
      }
    }
    return points;
  }

  public scale(factor: number) {
    const delta = new Vector(
      ((1 - factor) * this.width) / 2,
      ((1 - factor) * this.height) / 2,
    );
    const newTopLeft = this.center.add(delta.mult(-1));
    const newBottomRight = this.center.add(delta);
    return new Rectangle(newTopLeft, newBottomRight);
  }

  public contains(point: Vector): boolean {
    return (
      point.x >= this.topLeft.x &&
      point.x <= this.bottomRight.x &&
      point.y >= this.topLeft.y &&
      point.y <= this.bottomRight.y
    );
  }
}
