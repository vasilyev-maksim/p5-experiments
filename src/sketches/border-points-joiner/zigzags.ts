import p5 from "p5";
import type {
  ExtractParams,
  IControls,
  IPreset,
  ISketch,
  ISketchFactory,
} from "../../models";
import { SquareBorderPointsJoiner } from "./joiner";

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
  ({ initialCanvasWidth, initialCanvasHeight }) =>
  (p) => {
    const SIZE = Math.min(initialCanvasWidth, initialCanvasHeight);

    let time: number = 0,
      COLOR_INDEX: number,
      TIME_DELTA: number,
      RESOLUTION: number,
      PADDING_PERCENT: number;

    p.setup = () => {
      p.createCanvas(initialCanvasWidth, initialCanvasHeight);
      p.angleMode("radians");
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
      // p.noLoop();
      time += TIME_DELTA;
      p.background("black");

      const color = controls.COLOR.colors[COLOR_INDEX][0];
      p.stroke(color);

      const ACTUAL_SIZE = SIZE * (1 - PADDING_PERCENT / 100);
      const r = RESOLUTION;
      const x0 = (initialCanvasWidth - ACTUAL_SIZE) / 2;
      const y0 = (initialCanvasHeight - ACTUAL_SIZE) / 2;
      const joiner = new SquareBorderPointsJoiner(
        p.createVector(x0, y0),
        p.createVector(x0 + ACTUAL_SIZE, y0 + ACTUAL_SIZE),
        r,
        r
      );

      // joiner.renderPoints(p);

      const [intervals, intervals2] = [
        [
          [0, r],
          [r * 2, r],
        ],
        [
          [r * 4, r * 3],
          [r * 2, r * 3],
        ],
      ] as [number, number][][];

      const cb = (a: p5.Vector, b: p5.Vector) => {
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

      joiner.renderJoints(intervals[0], intervals[1], cb);
      joiner.renderJoints(intervals2[0], intervals2[1], cb);
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
        [i * stepLength - (i === 0 ? 0 : dropShift), i * dropHeight],
        [
          (i + 1) * stepLength + (i === stepsCount - 1 ? 0 : dropShift),
          i * dropHeight,
        ],
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
      PADDING_PERCENT: 20,
    },
    name: "escalator",
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
