import p5 from "p5";
import type {
  ExtractParams,
  IControls,
  IPreset,
  ISketch,
  ISketchFactory,
} from "../models";
import { oscillateBetween } from "./utils";

const controls = {
  TIME_DELTA: {
    type: "range",
    min: 0,
    max: 3,
    defaultValue: 1,
    step: 0.1,
    label: "Playback speed",
    valueFormatter: (x) => x.toFixed(1),
  },
  STEPS: {
    type: "range",
    min: 1,
    max: 60,
    defaultValue: 60,
    step: 1,
    label: "Steps",
  },
  MAX_CURVATURE: {
    type: "range",
    min: 0,
    max: 2.5,
    defaultValue: 2,
    step: 0.1,
    label: "Max curvature",
  },
  MIN_CURVATURE: {
    type: "range",
    min: -2.5,
    max: 0,
    defaultValue: 0,
    step: 0.1,
    label: "Min curvature",
  },
  PADDING: {
    type: "range",
    min: 0,
    max: 400,
    defaultValue: 100,
    step: 1,
    label: "Padding",
  },
  COLOR: {
    type: "color",
    colors: [
      ["#ea72f7ff"],
      ["#ff0000ff"],
      ["#aa00ffff"],
      ["#00a6ffff"],
      ["#00ff4cff"],
      ["#ffffffff"],
    ],
    defaultValue: 0,
    label: "Color",
  },
} as const satisfies IControls;

type Params = ExtractParams<typeof controls>;

const factory: ISketchFactory<Params> =
  (WIDTH, HEIGHT, _randomSeed, timeShift) => (p) => {
    const SIZE = Math.min(WIDTH, HEIGHT),
      W = SIZE,
      H = SIZE;

    let time: number = timeShift,
      COLOR_INDEX: number = controls.COLOR.defaultValue,
      TIME_DELTA: number = controls.TIME_DELTA.defaultValue,
      STEPS: number = controls.STEPS.defaultValue,
      PADDING: number = controls.PADDING.defaultValue,
      MIN_CURVATURE: number = controls.MIN_CURVATURE.defaultValue,
      MAX_CURVATURE: number = controls.MAX_CURVATURE.defaultValue;

    p.setup = () => {
      p.createCanvas(WIDTH, HEIGHT);
      p.angleMode("radians");
      // p.noLoop();
    };

    p.updateWithProps = (props) => {
      COLOR_INDEX = props.COLOR;
      TIME_DELTA = props.TIME_DELTA;
      STEPS = props.STEPS;
      MAX_CURVATURE = props.MAX_CURVATURE;
      MIN_CURVATURE = props.MIN_CURVATURE;
      PADDING = props.PADDING;

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
      strokeColor: string = "black"
    ): void {
      const startToEndAngle =
        p.PI / 2 + p.atan(p.abs(x1 - x0) / p.abs(y1 - y0));
      const stepAngle = p.map(
        p.abs((time % 120) - 60),
        0,
        60,
        startToEndAngle,
        p.PI / 4
      );

      const dropsCount = STEPS - 1;
      const stepLength = 1 / STEPS,
        dropHeight = 1 / dropsCount,
        dropShift = dropHeight / p.tan(stepAngle) / 2;

      const scaleX = x1 - x0;
      const scaleY = y1 - y0;

      p.push();
      {
        p.stroke(strokeColor);
        p.translate(x0, y0);
        p.scale(scaleX, scaleY);
        p.strokeWeight(2 / p.max(scaleX, scaleY));

        let vertices: [number, number][] = [];

        for (let i = 0; i < STEPS; i++) {
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
      time += TIME_DELTA;
      p.background("black");

      const color = controls.COLOR.colors[COLOR_INDEX][0];
      p.stroke(color);

      const steps = STEPS;
      const x0 = (WIDTH - W + PADDING) / 2;
      const y0 = (HEIGHT - H + PADDING) / 2;
      const traveler = new RectangleBorderTraveler(
        p.createVector(x0, y0),
        p.createVector(x0 + W - PADDING, y0 + H - PADDING),
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
      const cb =
        (curvatureSign: 1 | -1) =>
        ([a, b]: [p5.Vector, p5.Vector], i: number, n: number) => {
          // p.circle(a.x, a.y, 3);
          // p.circle(b.x, b.y, 3);
          // drawZigzag(p, a.x, a.y, b.x, b.y, color);
          const maxCurvature =
            (i / n) * (((SIZE - PADDING) * 2) / p.sqrt(2)) * curvatureSign || 1;
          const curvature = oscillateBetween(
            p,
            maxCurvature * MIN_CURVATURE,
            maxCurvature * MAX_CURVATURE,
            0.04,
            time
          );
          drawArc(p, a, b, curvature);
        };

      traveler.combineIntervals(intervals[0], intervals[1], cb(1));
      traveler.combineIntervals(intervals2[0], intervals2[1], cb(-1));
    };
  };

function drawArc(p: p5, a: p5.Vector, b: p5.Vector, curvature: number) {
  p.push();
  {
    p.noFill();
    const ab = p5.Vector.sub(b, a);
    const am = ab.mult(0.5);
    const amMag = am.mag();
    const m = p5.Vector.lerp(b, a, 0.5);
    const angle = am.heading();
    p.translate(m.x, m.y);
    // console.log(angle, m.x, m.y);
    p.rotate(angle);
    // p.circle(0, 0, 2);
    // p.line(-200, 0, 200, 0);
    p.arc(
      0,
      0,
      amMag * 2,
      p.abs(curvature),
      // oscillateBetween(p, -350, 350, 0.1, time),
      Math.sign(curvature) > 0 ? 0 : p.PI,
      Math.sign(curvature) > 0 ? p.PI : p.TWO_PI
    );
  }
  p.pop();
}

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
const presets: IPreset<Params>[] = [
  {
    params: {
      TIME_DELTA: 1,
      COLOR: 0,
      STEPS: 60,
      MAX_CURVATURE: 1,
      MIN_CURVATURE: 0,
      PADDING: 0,
    },
    name: "Default",
  },
  {
    params: {
      TIME_DELTA: 1,
      COLOR: 5,
      STEPS: 30,
      MAX_CURVATURE: 2,
      MIN_CURVATURE: -1,
      PADDING: 400,
    },
    name: "Mayonnaise",
  },
  {
    params: {
      TIME_DELTA: 1,
      STEPS: 6,
      MAX_CURVATURE: 1.6,
      MIN_CURVATURE: -0.7999999999999998,
      PADDING: 350,
      COLOR: 0,
    },
    name: "Croissant",
  },
  {
    params: {
      TIME_DELTA: 0.8,
      STEPS: 18,
      MAX_CURVATURE: 0.6000000000000001,
      MIN_CURVATURE: -0.2999999999999998,
      PADDING: 350,
      COLOR: 0,
    },
    name: "Cookie",
  },
];

export const escalatorSketch: ISketch<Params> = {
  factory,
  id: "escalator",
  name: "escalator",
  preview: {
    size: 300,
  },
  // timeShift: 111,
  timeShift: 60,
  controls,
  presets,
};
