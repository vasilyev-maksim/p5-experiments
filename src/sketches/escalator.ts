import p5 from "p5";
import type { SketchFactory } from "../models";

export const escalator: SketchFactory =
  (WIDTH, HEIGHT, _randomSeed, timeShift) => (p) => {
    const min = Math.min(WIDTH, HEIGHT),
      W = min,
      H = min,
      STEPS_COUNT = 20;

    p.setup = () => {
      p.createCanvas(W, H);
    };

    p.updateWithProps = (props) => {
      if (props.playing) {
        p.loop();
      } else {
        p.noLoop();
      }
    };

    function drawZigzag(
      p: p5,
      x0: number,
      y0: number,
      x1: number,
      y1: number,
      stroke: string = "black"
    ): void {
      const time = p.frameCount + timeShift;
      const startToEndAngle =
        p.PI / 2 + p.atan(p.abs(x1 - x0) / p.abs(y1 - y0));
      const stepAngle = p.map(
        p.abs((time % 120) - 60),
        0,
        60,
        startToEndAngle,
        p.PI / 4
      );

      const dropsCount = STEPS_COUNT - 1;
      const stepLength = 1 / STEPS_COUNT,
        dropHeight = 1 / dropsCount,
        dropShift = dropHeight / p.tan(stepAngle) / 2;

      const scaleX = x1 - x0;
      const scaleY = y1 - y0;

      p.push();
      {
        p.stroke(stroke);
        p.translate(x0, y0);
        p.scale(scaleX, scaleY);
        p.strokeWeight(2 / p.max(scaleX, scaleY));

        let vertices: [number, number][] = [];

        for (let i = 0; i < STEPS_COUNT; i++) {
          vertices = vertices.concat([
            [i * stepLength - dropShift, i * dropHeight],
            [(i + 1) * stepLength + dropShift, i * dropHeight],
          ]);
        }

        p.beginShape();
        p.fill(0, 0, 0, 0);
        vertices.forEach(([x, y]) => {
          p.vertex(x, y);
        });
        p.endShape();
      }
      p.pop();
    }

    p.draw = () => {
      p.background(0);

      const steps = 60;
      const traveler = new RectangleBorderTraveler(
        p.createVector(0, 0),
        p.createVector(W, H),
        steps,
        steps
      );
      const pLen = traveler.points.length;
      const [intervals, intervals2] = [
        [
          [0, steps],
          [steps * 2, steps],
        ],
        [
          [steps * 4, steps * 3],
          [steps * 2, steps * 3],
        ],
        [
          [0, pLen],
          [steps, pLen + steps],
        ],
      ] as [number, number][][];
      const cb = ([a, b]: [p5.Vector, p5.Vector]) => {
        drawZigzag(p, a.x, a.y, b.x, b.y, "#ea72f7ff");
      };
      traveler.combineIntervals(intervals[0], intervals[1], cb);
      traveler.combineIntervals(intervals2[0], intervals2[1], cb);
    };
  };

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
      this.points.push(new p5.Vector(ix * dx, this.a.y));
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
    cb: (interval: [p5.Vector, p5.Vector]) => void
  ): void {
    const starts = this.cyclicSubset(this.points, ...startIndexes);
    const ends = this.cyclicSubset(this.points, ...endIndexes);

    const intervals = starts
      .map((start, i) => (ends[i] ? [start, ends[i]] : null), [])
      .filter(Boolean) as [p5.Vector, p5.Vector][];

    intervals.forEach((x) => cb(x));
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
