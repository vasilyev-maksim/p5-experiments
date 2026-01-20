import p5 from "p5";
import type { ExtractParams, IControls, IPreset, ISketch } from "../models";
import {
  SquareBorderPointsJoiner,
  type JointRenderCallback,
} from "./utils/BorderPointsJoiner";
import { createSketchFactory } from "./utils/sketchFactory";
import { oscillateBetween } from "./utils/misc";

const controls = {
  RESOLUTION: {
    type: "range",
    min: 2,
    max: 60,
    step: 1,
    label: "Resolution",
  },
  MAX_CURVATURE: {
    type: "range",
    min: 0,
    max: 2,
    step: 0.05,
    label: "Max curvature",
    valueFormatter: (x) => x.toFixed(2),
  },
  MAX_NEGATIVE_CURVATURE: {
    type: "range",
    min: 0,
    max: 2,
    step: 0.05,
    label: "Max negative curvature",
    valueFormatter: (x) => x.toFixed(2),
  },
  PADDING_PERCENT: {
    type: "range",
    min: 0,
    max: 50,
    step: 1,
    label: "Padding",
    valueFormatter: (x) => x + "%",
  },
  PATTERN_TYPE: {
    type: "choice",
    options: [
      { label: "#1", value: 0 },
      { label: "#2", value: 1 },
      { label: "#3", value: 2 },
      { label: "#4", value: 3 },
      { label: "#5", value: 4 },
    ],
    label: "Pattern type",
  },
  CURVATURE_TYPE: {
    type: "choice",
    options: [
      { label: "dynamic", value: 0 },
      { label: "dynamic inverted", value: 1 },
      { label: "static", value: 2 },
    ],
    label: "Curvature type",
  },
  INVERT_COLORS: {
    type: "boolean",
    label: "Invert colors",
  },
  COLOR: {
    type: "color",
    colors: [
      ["#0000ffff", "#ea72f7ff"],
      ["#fcff39ff", "#c04affff"],
      ["#18005fff", "#5aff4aff"],
      // ["#ffffffff", "#1e00c8ff"],
      ["#ffffffff", "#000000ff"],
    ],
    label: "Color",
  },
} as const satisfies IControls;

type Params = ExtractParams<typeof controls>;

const factory = createSketchFactory<Params>((p, getProp) => {
  return {
    setup: () => {
      p.angleMode("radians");
      // p.background('black');
    },
    draw: (time) => {
      p.background("black");
      const PADDING_PERCENT = getProp("PADDING_PERCENT").value!,
        RESOLUTION = getProp("RESOLUTION").value!,
        CURVATURE_TYPE = getProp("CURVATURE_TYPE").value!,
        MAX_NEGATIVE_CURVATURE = getProp("MAX_NEGATIVE_CURVATURE").value!,
        MAX_CURVATURE = getProp("MAX_CURVATURE").value!,
        COLOR_INDEX = getProp("COLOR").value!,
        PATTERN_TYPE = getProp("PATTERN_TYPE").value!,
        INVERT_COLORS = getProp("INVERT_COLORS").value!;

      const SIZE = Math.min(p.width, p.height),
        ACTUAL_SIZE = SIZE * (1 - PADDING_PERCENT / 100),
        x0 = (p.width - ACTUAL_SIZE) / 2,
        y0 = (p.height - ACTUAL_SIZE) / 2;

      const r = RESOLUTION,
        r2 = r * 2,
        r3 = r * 3,
        r4 = r * 4;

      const joiner = new SquareBorderPointsJoiner(
        p.createVector(x0, y0),
        p.createVector(x0 + ACTUAL_SIZE, y0 + ACTUAL_SIZE),
        r,
        r
      );

      const render =
        (curvatureSign: 1 | -1) =>
        (a: p5.Vector, b: p5.Vector, i: number, n: number) => {
          if (a.equals(b) || !a || !b) return;

          const halfDiagonal = (ACTUAL_SIZE * 2) / p.sqrt(2);
          const curvatureFactor =
            CURVATURE_TYPE === 0 ? i / n : CURVATURE_TYPE === 1 ? 1 - i / n : 1;
          const distanceToDiagonal =
            curvatureFactor * halfDiagonal * curvatureSign || 1;
          const curvature = oscillateBetween(
            p,
            distanceToDiagonal * MAX_NEGATIVE_CURVATURE * -1,
            distanceToDiagonal * MAX_CURVATURE,
            0.02,
            time
          );
          const colorIntensity = p.map(p.abs(curvature), 0, halfDiagonal, 1, 0);
          const [c1, c2] = controls.COLOR.colors[COLOR_INDEX];
          const colorA = INVERT_COLORS ? c2 ?? c1 : c1;
          const colorB = INVERT_COLORS ? c1 ?? c2 : c2 ?? c1;

          drawArc({
            p,
            a,
            b,
            curvature,
            colorIntensity,
            colorA,
            colorB,
          });
        };

      let intervals: [
        [number, number],
        [number, number],
        JointRenderCallback
      ][];
      if (PATTERN_TYPE === 0) {
        intervals = [
          [[0, r], [r2, r], render(1)],
          [[r4, r3], [r2, r3], render(-1)],
        ];
      } else if (PATTERN_TYPE === 1) {
        intervals = [
          [[0, r2], [r2, 0], render(1)],
          [[r2, r4], [r4, r2], render(1)],
        ];
      } else if (PATTERN_TYPE === 2) {
        intervals = [
          [[0, r], [r, r2], render(1)],
          [[r3, r4], [r2, r3], render(-1)],
          [[r, r2], [r2, r3], render(1)],
          [[0, r], [r3, r4], render(-1)],
        ];
      } else if (PATTERN_TYPE === 3) {
        intervals = [
          [[0, r / 2], [r2 + (r * 3) / 4, r2 + r / 4], render(1)],
          [[r, r / 2], [r2 + r / 4, r2 + (r * 3) / 4], render(-1)],
          [[r3, r2 + r / 2], [r / 4, r - r / 4], render(-1)],
          [[r2, r2 + r / 2], [r - r / 4, r / 4], render(1)],
        ];
      } else {
        intervals = [
          [[0, r / 2], [r, r - r / 2], render(1)],
          [[r, r / 2], [r, r + r / 2], render(1)],
          [[r, r + r / 2], [r2, r2 - r / 2], render(1)],
          [[r2, r + r / 2], [r2, r2 + r / 2], render(1)],
          [[r2, r2 + r / 2], [r3, r3 - r / 2], render(1)],
          [[r3, r2 + r / 2], [r3, r3 + r / 2], render(1)],
          [[r3, r3 + r / 2], [0, -r / 2], render(1)],
          [[r4, r3 + r / 2], [r4, r4 + r / 2], render(1)],
        ];
      }

      intervals.forEach(([starts, ends, cb]) => {
        joiner.renderJoints(starts, ends, cb);
      });
    },
  };
});

function drawArc({
  p,
  a,
  b,
  curvature,
  colorIntensity,
  colorA,
  colorB,
}: {
  p: p5;
  a: p5.Vector;
  b: p5.Vector;
  curvature: number;
  colorIntensity: number;
  colorA: string;
  colorB: string;
}) {
  p.push();
  {
    const ab = p5.Vector.sub(b, a);
    const am = ab.mult(0.5);
    const amMag = am.mag();
    const m = p5.Vector.lerp(b, a, 0.5);
    const angle = am.heading();
    const curAbs = p.abs(curvature);
    const curSign = Math.sign(curvature);

    p.noFill();
    p.stroke(p.lerpColor(p.color(colorA), p.color(colorB), colorIntensity));
    p.translate(m.x, m.y);
    p.rotate(angle);
    p.strokeWeight((2 * p.width) / 1158);
    p.arc(
      0,
      0,
      amMag * 2,
      curAbs,
      curSign > 0 ? 0 : p.PI,
      curSign > 0 ? p.PI : p.TWO_PI
    );
  }
  p.pop();
}

const presets: IPreset<Params>[] = [
  {
    params: {
      timeDelta: 1,
      COLOR: 0,
      RESOLUTION: 60,
      MAX_CURVATURE: 1,
      MAX_NEGATIVE_CURVATURE: 0,
      PADDING_PERCENT: 10,
      INVERT_COLORS: 0,
      PATTERN_TYPE: 0,
      CURVATURE_TYPE: 0,
    },
    name: "touch",
  },
  {
    params: {
      timeDelta: 1,
      COLOR: 0,
      RESOLUTION: 18,
      MAX_CURVATURE: 1,
      MAX_NEGATIVE_CURVATURE: 0,
      PADDING_PERCENT: 40,
      INVERT_COLORS: 0,
      PATTERN_TYPE: 1,
      CURVATURE_TYPE: 0,
    },
    name: "khachapuri",
  },
  {
    params: {
      timeDelta: 1,
      RESOLUTION: 6,
      MAX_CURVATURE: 2,
      MAX_NEGATIVE_CURVATURE: 0.6,
      PADDING_PERCENT: 45,
      COLOR: 0,
      INVERT_COLORS: 0,
      PATTERN_TYPE: 0,
      CURVATURE_TYPE: 0,
    },
    name: "croissant",
  },
  {
    params: {
      timeDelta: 1.5,
      COLOR: 0,
      RESOLUTION: 60,
      MAX_CURVATURE: 0.8,
      MAX_NEGATIVE_CURVATURE: 0,
      PADDING_PERCENT: 34,
      INVERT_COLORS: 0,
      PATTERN_TYPE: 3,
      CURVATURE_TYPE: 1,
    },
    name: "torus",
  },
  {
    params: {
      timeDelta: 1,
      RESOLUTION: 20,
      MAX_CURVATURE: 0.1,
      MAX_NEGATIVE_CURVATURE: 3,
      PADDING_PERCENT: 50,
      COLOR: 3,
      INVERT_COLORS: 1,
      PATTERN_TYPE: 2,
      CURVATURE_TYPE: 0,
    },
    name: "springs",
  },
  {
    params: {
      timeDelta: 1.5,
      RESOLUTION: 60,
      MAX_CURVATURE: 1.2,
      MAX_NEGATIVE_CURVATURE: 0,
      PADDING_PERCENT: 10,
      COLOR: 1,
      INVERT_COLORS: 0,
      PATTERN_TYPE: 2,
      CURVATURE_TYPE: 0,
    },
    name: "flower",
  },
  {
    params: {
      timeDelta: 1,
      RESOLUTION: 60,
      MAX_CURVATURE: 0.5,
      MAX_NEGATIVE_CURVATURE: 1.5,
      PADDING_PERCENT: 31,
      COLOR: 0,
      INVERT_COLORS: 0,
      PATTERN_TYPE: 2,
      CURVATURE_TYPE: 2,
    },
    name: "cube",
  },
  {
    params: {
      timeDelta: 1,
      RESOLUTION: 6,
      MAX_CURVATURE: 0.025,
      MAX_NEGATIVE_CURVATURE: 0.025,
      PADDING_PERCENT: 45,
      COLOR: 2,
      INVERT_COLORS: 0,
      PATTERN_TYPE: 1,
      CURVATURE_TYPE: 2,
    },
    name: "scars",
  },
  {
    params: {
      timeDelta: 1.2,
      RESOLUTION: 30,
      MAX_CURVATURE: 0.9,
      MAX_NEGATIVE_CURVATURE: 0.5,
      PADDING_PERCENT: 45,
      COLOR: 0,
      INVERT_COLORS: 0,
      PATTERN_TYPE: 2,
      CURVATURE_TYPE: 2,
    },
    name: "demogorgon",
  },
  {
    params: {
      timeDelta: 0.8,
      RESOLUTION: 60,
      MAX_CURVATURE: 0.5,
      MAX_NEGATIVE_CURVATURE: 0.5,
      PADDING_PERCENT: 45,
      COLOR: 1,
      INVERT_COLORS: 0,
      PATTERN_TYPE: 4,
      CURVATURE_TYPE: 2,
    },
    name: "cotton",
  },
  {
    params: {
      timeDelta: 1.2,
      RESOLUTION: 24,
      MAX_CURVATURE: 0.7,
      MAX_NEGATIVE_CURVATURE: 0.5,
      PADDING_PERCENT: 45,
      COLOR: 2,
      INVERT_COLORS: 0,
      PATTERN_TYPE: 4,
      CURVATURE_TYPE: 1,
    },
    name: "jungle",
  },
];

export const arcSketch: ISketch<Params> = {
  factory,
  id: "arcs",
  name: "arcs",
  preview: {
    size: 300,
  },
  timeShift: 236,
  controls,
  presets,
  defaultParams: presets[0].params,
};
