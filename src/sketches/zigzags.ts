import p5 from "p5";
import type { ExtractParams, IControls, IPreset, ISketch } from "../models";
import { SquareBorderPointsJoiner } from "@core/BorderPointsJoiner";
import { createSketch } from "@core/createSketch";

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

const factory = createSketch<Params>(({ p, getProp, getTime }) => {
  return {
    setup: () => {
      p.angleMode("radians");
    },
    draw: () => () => {
      const time = getTime();

      p.background("black");
      const PADDING_PERCENT = getProp("PADDING_PERCENT"),
        RESOLUTION = getProp("RESOLUTION"),
        COLOR_INDEX = getProp("COLOR");

      const color = controls.COLOR.colors[COLOR_INDEX][0];
      p.stroke(color);

      const SIZE = Math.min(p.width, p.height),
        ACTUAL_SIZE = SIZE * (1 - PADDING_PERCENT / 100),
        x0 = (p.width - ACTUAL_SIZE) / 2,
        y0 = (p.height - ACTUAL_SIZE) / 2;
      const r = RESOLUTION;
      const joiner = new SquareBorderPointsJoiner(
        p.createVector(x0, y0),
        p.createVector(x0 + ACTUAL_SIZE, y0 + ACTUAL_SIZE),
        r,
        r,
      );

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
          p.PI / 4,
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
    },
  };
});

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
      timeDelta: 1,
      COLOR: 5,
      RESOLUTION: 60,
      PADDING_PERCENT: 20,
    },
    name: "escalator",
    startTime: 179,
  },
];

export const zigzagsSketch: ISketch<Params> = {
  factory,
  id: "zigzags",
  name: "zigzags",
  preview: {
    size: 300,
  },
  controls,
  presets,
};
