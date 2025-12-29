import p5 from "p5";

export type JoinRenderCallback = (
  start: p5.Vector,
  end: p5.Vector,
  index: number,
  totalCount: number
) => void;

export class SquareBorderPointsJoiner {
  private points: p5.Vector[] = [];

  public constructor(
    private readonly a: p5.Vector,
    private readonly b: p5.Vector,
    private readonly stepsX: number,
    private readonly stepsY: number
  ) {
    this.initPoints();
  }

  private initPoints(): void {
    const dx = (this.b.x - this.a.x) / this.stepsX;
    const dy = (this.b.y - this.a.y) / this.stepsY;

    for (let ix = 0; ix <= this.stepsX; ix++) {
      this.points.push(new p5.Vector(this.a.x + ix * dx, this.a.y));
    }
    for (let iy = 1; iy <= this.stepsY; iy++) {
      this.points.push(new p5.Vector(this.b.x, this.a.y + iy * dy));
    }
    for (let ix = 1; ix <= this.stepsX; ix++) {
      this.points.push(new p5.Vector(this.b.x - ix * dx, this.b.y));
    }
    for (let iy = 1; iy < this.stepsY; iy++) {
      this.points.push(new p5.Vector(this.a.x, this.b.y - iy * dy));
    }
  }

  public renderJoints(
    startPointsInterval: [number, number],
    endPointsInterval: [number, number],
    cb: JoinRenderCallback
  ) {
    const starts = this.cyclicSubset(...startPointsInterval);
    const ends = this.cyclicSubset(...endPointsInterval);

    starts.forEach((start, i, arr) =>
      cb(this.points[start], this.points[ends[i]], i, arr.length || 0)
    );
  }

  private cyclicSubset(start: number, end: number): number[] {
    const result = [];
    const len = this.points.length;
    const step = start < end ? 1 : -1; // Определяем направление

    for (let i = start; i !== end; i += step) {
      result.push(((i % len) + len) % len); // Обеспечиваем циклический доступ к элементам массива
    }

    return result;
  }
}
