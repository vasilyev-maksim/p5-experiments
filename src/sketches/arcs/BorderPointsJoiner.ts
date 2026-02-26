import p5 from "p5";

export type JointRenderCallback = (
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

  // private initPoints(): void {
  //   const r = p5.Vector.sub(this.a, this.b).mag() / 2;
  //   const center = p5.Vector.lerp(this.a, this.b, 0.5);
  //   const d = (Math.PI * 2) / this.stepsX;

  //   for (let i = 0; i < this.stepsX; i++) {
  //     this.points.push(
  //       new p5.Vector(
  //         center.x + r * Math.cos(i * d),
  //         center.y + r * Math.sin(i * d)
  //       )
  //     );
  //   }
  // }

  public renderPoints(p: p5) {
    p.push();
    {
      p.stroke("white");
      this.points.forEach(({ x, y }) => {
        p.circle(x, y, 5);
      });
    }
    p.pop();
  }

  public renderJoints(
    startPointsInterval: [number, number],
    endPointsInterval: [number, number],
    cb: JointRenderCallback
  ) {
    const starts = this.cyclicSubset(...startPointsInterval);
    const ends = this.cyclicSubset(...endPointsInterval);

    starts.forEach((start, i, arr) =>
      cb(
        this.points[Math.floor(start)],
        this.points[Math.floor(ends[i])],
        i,
        arr.length || 0
      )
    );
  }

  private cyclicSubset(start: number, end: number): number[] {
    const result = [];
    const len = this.points.length;
    const step = start < end ? 1 : -1;

    for (let i = Math.floor(start); i !== Math.floor(end) + step; i += step) {
      result.push(((i % len) + len) % len); // considers negative indexes too
    }

    return result;
  }
}
