import p5 from "p5";
import type {
  ExtractParams,
  IControls,
  IPreset,
  ISketch,
  ISketchFactory,
} from "../../models";
import { oscillateBetween } from "../utils";
import { RectangleBorderTraveler } from "./traveler";

const controls = {
  STEPS: {
    type: "range",
    min: 1,
    max: 60,
    step: 1,
    label: "Steps",
  },
  MAX_CURVATURE: {
    type: "range",
    min: 0,
    max: 2.5,
    step: 0.1,
    label: "Max curvature",
    valueFormatter: (x) => x.toFixed(1),
  },
  MIN_CURVATURE: {
    type: "range",
    min: -2.5,
    max: 0,
    step: 0.1,
    label: "Min curvature",
    valueFormatter: (x) => x.toFixed(1),
  },
  PADDING_PERCENT: {
    type: "range",
    min: 0,
    max: 50,
    step: 1,
    label: "Padding",
    valueFormatter: (x) => x + "%",
  },
  INVERT_CURVATURE: {
    type: "boolean",
    label: "Invert curvature",
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
      ["#13005fff", "#a3ff9aff"],
      ["#ffffffff", "#1e00c8ff"],
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
      STEPS: number,
      PADDING_PERCENT: number,
      MIN_CURVATURE: number,
      MAX_CURVATURE: number,
      INVERT_COLORS: number,
      INVERT_CURVATURE: number;

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
      PADDING_PERCENT = props.PADDING_PERCENT;
      INVERT_CURVATURE = props.INVERT_CURVATURE;
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
      const steps = STEPS;
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
      const cb =
        (curvatureSign: 1 | -1) =>
        ([a, b]: [p5.Vector, p5.Vector], i: number, n: number) => {
          const halfDiagonal = (ACTUAL_SIZE * 2) / p.sqrt(2);
          const distanceToDiagonal =
            (INVERT_CURVATURE ? 1 - i / n : i / n) *
              halfDiagonal *
              curvatureSign || 1;
          const curvature = oscillateBetween(
            p,
            distanceToDiagonal * MIN_CURVATURE,
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

      traveler.combineIntervals(intervals[0], intervals[1], cb(1));
      traveler.combineIntervals(intervals2[0], intervals2[1], cb(-1));

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
      STEPS: 60,
      MAX_CURVATURE: 1,
      MIN_CURVATURE: 0,
      PADDING_PERCENT: 20,
      INVERT_CURVATURE: 0,
      INVERT_COLORS: 0,
    },
    name: "touch",
  },
  {
    params: {
      TIME_DELTA: 1,
      COLOR: 0,
      STEPS: 30,
      MAX_CURVATURE: 1,
      MIN_CURVATURE: -1,
      PADDING_PERCENT: 50,
      INVERT_CURVATURE: 0,
      INVERT_COLORS: 0,
    },
    name: "mayonnaise",
  },
  {
    params: {
      TIME_DELTA: 1,
      STEPS: 6,
      MAX_CURVATURE: 1.6,
      MIN_CURVATURE: -0.7999999999999998,
      PADDING_PERCENT: 45,
      COLOR: 0,
      INVERT_CURVATURE: 0,
      INVERT_COLORS: 0,
    },
    name: "croissant",
  },
  {
    params: {
      TIME_DELTA: 0.8,
      STEPS: 18,
      MAX_CURVATURE: 0.6000000000000001,
      MIN_CURVATURE: -0.2999999999999998,
      PADDING_PERCENT: 50,
      COLOR: 0,
      INVERT_CURVATURE: 0,
      INVERT_COLORS: 0,
    },
    name: "cookie",
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
