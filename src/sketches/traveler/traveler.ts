import p5 from "p5";

export class RectangleBorderTraveler {
  public readonly points: p5.Vector[] = [];

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

  public combineIntervals(
    startIndexes: [number, number],
    endIndexes: [number, number],
    cb: (
      interval: [p5.Vector, p5.Vector],
      index: number,
      intervalsCount: number
    ) => void
  ): void {
    const starts = this.cyclicSubset(this.points, ...startIndexes);
    const ends = this.cyclicSubset(this.points, ...endIndexes);

    const intervals = starts
      .map((start, i) => (ends[i] ? [start, ends[i]] : null), [])
      .filter(Boolean) as [p5.Vector, p5.Vector][];

    intervals.forEach((x, i, arr) => cb(x, i, arr.length || 0));
  }

  private cyclicSubset<T>(arr: T[], start: number, end: number): T[] {
    const result = [];
    const len = arr.length;
    const step = start < end ? 1 : -1; // Определяем направление

    for (let i = start; i !== end; i += step) {
      result.push(arr[((i % len) + len) % len]); // Обеспечиваем циклический доступ к элементам массива
    }

    return result;
  }
}
