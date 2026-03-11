import type p5 from "p5";

export interface ISize {
  width: number;
  height: number;
  getArea(): number;
  getAspectRatio(): number;
}

export class Size implements ISize {
  constructor(
    public width: number,
    public height: number,
  ) {}

  public getArea(): number {
    return this.width * this.height;
  }

  public getAspectRatio(): number {
    return Math.max(this.width / this.height, this.height / this.width);
  }

  public static fromVector(v: p5.Vector): Size {
    return new Size(v.x, v.y);
  }
}
