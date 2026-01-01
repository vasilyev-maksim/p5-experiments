import p5 from "p5";
import type {
  ExtractParams,
  IControls,
  IPreset,
  ISketch,
  ISketchFactory,
} from "../../models";
import { oscillateBetween } from "../utils";
import { SquareBorderPointsJoiner, type JoinRenderCallback } from "./joiner";

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

const factory: ISketchFactory<Params> =
  (WIDTH, HEIGHT, _randomSeed, timeShift) => (p) => {
    const SIZE = Math.min(WIDTH, HEIGHT),
      BG_COLOR = "black";

    let time: number = timeShift,
      COLOR_INDEX: number,
      TIME_DELTA: number,
      RESOLUTION: number,
      PADDING_PERCENT: number,
      PATTERN_TYPE: number,
      MAX_CURVATURE: number,
      MAX_NEGATIVE_CURVATURE: number,
      INVERT_COLORS: number,
      CURVATURE_TYPE: number;

    p.setup = () => {
      p.createCanvas(WIDTH, HEIGHT);
      p.angleMode("radians");
    };

    p.updateWithProps = (props) => {
      COLOR_INDEX = props.COLOR;
      TIME_DELTA = props.TIME_DELTA;
      RESOLUTION = props.RESOLUTION;
      PATTERN_TYPE = props.PATTERN_TYPE;
      MAX_CURVATURE = props.MAX_CURVATURE;
      MAX_NEGATIVE_CURVATURE = props.MAX_NEGATIVE_CURVATURE;
      PADDING_PERCENT = props.PADDING_PERCENT;
      CURVATURE_TYPE = props.CURVATURE_TYPE;
      INVERT_COLORS = props.INVERT_COLORS;

      if (props.playing) {
        p.loop();
      } else {
        p.noLoop();
      }
    };

    p.draw = () => {
      p.background(BG_COLOR);

      const ACTUAL_SIZE = SIZE * (1 - PADDING_PERCENT / 100);
      const r = RESOLUTION,
        r2 = r * 2,
        r3 = r * 3,
        r4 = r * 4;
      const x0 = (WIDTH - ACTUAL_SIZE) / 2;
      const y0 = (HEIGHT - ACTUAL_SIZE) / 2;
      const joiner = new SquareBorderPointsJoiner(
        p.createVector(x0, y0),
        p.createVector(x0 + ACTUAL_SIZE, y0 + ACTUAL_SIZE),
        r,
        r
      );

      // joiner.renderPoints(p);
      // const pLen = joiner.points.length;

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

      let intervals: [[number, number], [number, number], JoinRenderCallback][];
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

      time += TIME_DELTA;
    };
  };

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
    p.strokeWeight(2);
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
      TIME_DELTA: 1,
      COLOR: 0,
      RESOLUTION: 60,
      MAX_CURVATURE: 1,
      MAX_NEGATIVE_CURVATURE: 0,
      PADDING_PERCENT: 20,
      INVERT_COLORS: 0,
      PATTERN_TYPE: 0,
      CURVATURE_TYPE: 0,
    },
    name: "touch",
  },
  {
    params: {
      TIME_DELTA: 1,
      COLOR: 0,
      RESOLUTION: 18,
      MAX_CURVATURE: 1,
      MAX_NEGATIVE_CURVATURE: 0,
      PADDING_PERCENT: 50,
      INVERT_COLORS: 0,
      PATTERN_TYPE: 1,
      CURVATURE_TYPE: 0,
    },
    name: "khachapuri",
  },
  {
    params: {
      TIME_DELTA: 1,
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
      TIME_DELTA: 1.5,
      COLOR: 0,
      RESOLUTION: 60,
      MAX_CURVATURE: 0.7999999999999997,
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
      TIME_DELTA: 1,
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
      TIME_DELTA: 1.5,
      RESOLUTION: 60,
      MAX_CURVATURE: 1.2,
      MAX_NEGATIVE_CURVATURE: 0,
      PADDING_PERCENT: 50,
      COLOR: 1,
      INVERT_COLORS: 0,
      PATTERN_TYPE: 2,
      CURVATURE_TYPE: 0,
    },
    name: "flower",
  },
  {
    params: {
      TIME_DELTA: 1,
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
      TIME_DELTA: 1,
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
      TIME_DELTA: 1.2000000000000002,
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
      TIME_DELTA: 0.8,
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
      TIME_DELTA: 1.2,
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
  defaultParams: presets[9].params,
};
