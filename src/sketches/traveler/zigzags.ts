import p5 from "p5";
import type {
  ExtractParams,
  IControls,
  IPreset,
  ISketch,
  ISketchFactory,
} from "../../models";
import { RectangleBorderTraveler } from "./traveler";

const controls = {
  RESOLUTION: {
    type: "range",
    min: 1,
    max: 60,
    step: 1,
    label: "Resolution",
  },
  PADDING_PERCENT: {
    type: "range",
    min: 0,
    max: 50,
    step: 1,
    label: "Padding",
    valueFormatter: (x) => x + "%",
  },
  TIME_DELTA: {
    type: "range",
    min: 0,
    max: 3,
    step: 0.1,
    label: "Playback speed",
    valueFormatter: (x) => x.toFixed(1),
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
    label: "Color",
  },
} as const satisfies IControls;

type Params = ExtractParams<typeof controls>;

const factory: ISketchFactory<Params> =
  (WIDTH, HEIGHT, _randomSeed, timeShift) => (p) => {
    const SIZE = Math.min(WIDTH, HEIGHT);

    let time: number = timeShift,
      COLOR_INDEX: number,
      TIME_DELTA: number,
      RESOLUTION: number,
      PADDING_PERCENT: number;

    p.setup = () => {
      p.createCanvas(WIDTH, HEIGHT);
      p.angleMode("radians");
      // p.noLoop();
    };

    p.updateWithProps = (props) => {
      COLOR_INDEX = props.COLOR;
      TIME_DELTA = props.TIME_DELTA;
      RESOLUTION = props.RESOLUTION;
      PADDING_PERCENT = props.PADDING_PERCENT;

      if (props.playing) {
        p.loop();
      } else {
        p.noLoop();
      }
    };

    p.draw = () => {
      time += TIME_DELTA;
      p.background("black");

      const color = controls.COLOR.colors[COLOR_INDEX][0];
      p.stroke(color);

      const ACTUAL_SIZE = SIZE * (1 - PADDING_PERCENT / 100);
      const steps = RESOLUTION;
      const x0 = (WIDTH - ACTUAL_SIZE) / 2;
      const y0 = (HEIGHT - ACTUAL_SIZE) / 2;
      const traveler = new RectangleBorderTraveler(
        p.createVector(x0, y0),
        p.createVector(x0 + ACTUAL_SIZE, y0 + ACTUAL_SIZE),
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
        const startToEndAngle =
          p.PI / 2 + p.atan(p.abs(b.x - a.x) / p.abs(b.y - a.y));
        const stepAngle = p.map(
          p.abs((time % 120) - 60),
          0,
          60,
          startToEndAngle,
          p.PI / 4
        );
        drawZigzag({
          p,
          x0: a.x,
          y0: a.y,
          x1: b.x,
          y1: b.y,
          stepsCount: RESOLUTION / 3,
          // Math.ceil((1 - i / n) * 100),
          stepAngle,
          lineWidth: 2,
        });
      };

      traveler.combineIntervals(intervals[0], intervals[1], cb);
      traveler.combineIntervals(intervals2[0], intervals2[1], cb);
    };
  };

function drawZigzag({
  p,
  x0,
  y0,
  x1,
  y1,
  stepsCount,
  stepAngle,
  lineWidth,
}: {
  p: p5;
  x0: number;
  y0: number;
  x1: number;
  y1: number;
  stepsCount: number;
  stepAngle: number;
  lineWidth: number;
}): void {
  const dropsCount = stepsCount - 1;
  const stepLength = 1 / stepsCount,
    dropHeight = 1 / dropsCount,
    dropShift = dropHeight / p.tan(stepAngle) / 2;

  const scaleX = x1 - x0;
  const scaleY = y1 - y0;

  p.push();
  {
    p.translate(x0, y0);
    p.scale(scaleX, scaleY);
    p.strokeWeight(lineWidth / p.max(scaleX, scaleY));

    let vertices: [number, number][] = [];

    for (let i = 0; i < stepsCount; i++) {
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

const presets: IPreset<Params>[] = [
  {
    params: {
      TIME_DELTA: 1,
      COLOR: 5,
      RESOLUTION: 60,
      PADDING_PERCENT: 0,
    },
    name: "escalator",
  },
  {
    params: {
      TIME_DELTA: 1,
      COLOR: 5,
      RESOLUTION: 30,
      PADDING_PERCENT: 50,
    },
    name: "mayonnaise",
  },
  {
    params: {
      TIME_DELTA: 1,
      RESOLUTION: 6,
      PADDING_PERCENT: 45,
      COLOR: 0,
    },
    name: "croissant",
  },
  {
    params: {
      TIME_DELTA: 0.8,
      RESOLUTION: 18,
      PADDING_PERCENT: 50,
      COLOR: 0,
    },
    name: "cookie",
  },
];

export const escalatorSketch: ISketch<Params> = {
  factory,
  id: "zigzags",
  name: "zigzags",
  preview: {
    size: 300,
  },
  timeShift: 60,
  controls,
  presets,
  defaultParams: presets[0].params,
};
