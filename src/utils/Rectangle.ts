import { Vector } from "./Vector";

export class Rectangle {
  public topLeft: Vector;
  public bottomRight: Vector;
  public center: Vector;
  public width: number;
  public height: number;

  constructor(p1: Vector, p2: Vector = p1) {
    const topLeft = new Vector(Math.min(p1.x, p2.x), Math.min(p1.y, p2.y));
    const bottomRight = new Vector(Math.max(p1.x, p2.x), Math.max(p1.y, p2.y));

    this.width = bottomRight.x - topLeft.x + 1;
    this.height = bottomRight.y - topLeft.y + 1;
    this.bottomRight = bottomRight;
    this.topLeft = topLeft;
    this.center = this.topLeft.add(new Vector(this.width / 2, this.height / 2));
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

  public contains(point: Vector): boolean {
    return (
      point.x >= this.topLeft.x &&
      point.x <= this.bottomRight.x &&
      point.y >= this.topLeft.y &&
      point.y <= this.bottomRight.y
    );
  }

  public getSize(): Vector {
    return new Vector(this.width, this.height);
  }

  public getAspectRatio(): number {
    return Math.max(this.width / this.height, this.height / this.width);
  }

  public getArea(): number {
    return this.width * this.height;
  }

  public getBiggestSize(): number {
    return Math.max(this.width, this.height);
  }

  public getSmallestSize(): number {
    return Math.min(this.width, this.height);
  }
}
