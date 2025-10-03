import p5 from "p5";
import { type ISize, Size } from "./Size";

export interface IRectangle extends ISize {
  topLeft: p5.Vector;
  bottomRight: p5.Vector;
  center: p5.Vector;
  width: number;
  height: number;
  getPointsRange: () => p5.Vector[];
  scale: (factor: number) => IRectangle;
}

export class Rectangle extends Size implements IRectangle {
  public topLeft: p5.Vector;
  public bottomRight: p5.Vector;
  public center: p5.Vector;

  constructor(p1: p5.Vector, p2: p5.Vector = p1) {
    const topLeft = new p5.Vector(Math.min(p1.x, p2.x), Math.min(p1.y, p2.y));
    const bottomRight = new p5.Vector(
      Math.max(p1.x, p2.x),
      Math.max(p1.y, p2.y)
    );

    const width = bottomRight.x - topLeft.x + 1;
    const height = bottomRight.y - topLeft.y + 1;

    super(width, height);

    this.bottomRight = bottomRight;
    this.topLeft = topLeft;
    this.center = this.topLeft.copy().add(new p5.Vector(width / 2, height / 2));
  }

  public getPointsRange() {
    const points = [];
    for (let x = this.topLeft.x; x <= this.bottomRight.x; x++) {
      for (let y = this.topLeft.y; y <= this.bottomRight.y; y++) {
        points.push(new p5.Vector(x, y));
      }
    }
    return points;
  }

  public scale(factor: number) {
    const newWidth = this.width * factor;
    const newHeight = this.height * factor;
    const newTopLeft = this.center.copy().add(
      new p5.Vector(-newWidth / 2, -newHeight / 2)
    );
    const newBottomRight = this.center.copy().add(
      new p5.Vector(newWidth / 2, newHeight / 2)
    );

    return new Rectangle(newTopLeft, newBottomRight);
  }
}
