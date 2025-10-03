export interface ISize {
  width: number;
  height: number;
  getArea(): number;
  getAspectRatio(): number;
}

export class Size implements ISize {
  constructor(public width: number, public height: number) {}

  getArea(): number {
    return this.width * this.height;
  }

  getAspectRatio(): number {
    return Math.max(this.width / this.height, this.height / this.width);
  }
}
