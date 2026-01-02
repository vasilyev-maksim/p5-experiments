import type {
  ExtractParams,
  IControls,
  IPreset,
  ISketch,
  ISketchFactory,
} from "../models";
import { range, ValueWithHistory } from "../utils";
import { AnimatedValue } from "./utils";

const controls = {
  GAP: {
    label: "Gap",
    max: 50,
    min: 10,
    step: 1,
    type: "range",
  },
  CURVES_COUNT: {
    label: "Curves count",
    max: 50,
    min: 1,
    step: 2,
    type: "range",
  },
  TRACE_FACTOR: {
    label: "Trace factor",
    max: 100,
    min: 0,
    step: 1,
    type: "range",
    valueFormatter: (x) => x + "%",
  },
  FRACTURE_FREQUENCY: {
    label: "Fracture frequency",
    max: 100,
    min: 5,
    step: 1,
    type: "range",
  },
  DISPERSION: {
    label: "Dispersion",
    max: 1,
    min: 0,
    step: 0.05,
    type: "range",
    valueFormatter: (x) => x.toFixed(2),
  },
  NOISE_FACTOR: {
    label: "Noise factor",
    max: 0.06,
    min: 0.001,
    step: 0.0001,
    type: "range",
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
    colors: [["#ff0000ff"], ["#00fbffff"], ["#36ff1fff"], ["#ffffffff"]],
    label: "Color palette",
  },
} as const satisfies IControls;

type Params = ExtractParams<typeof controls>;

const factory: ISketchFactory<Params> =
  (WIDTH, HEIGHT, randomSeed, timeShift) => (p) => {
    const SPEED = 20;
    const FRACTURE_FREQUENCY = new ValueWithHistory<number>();

    let Y_COORDS: AnimatedValue[] = [];

    let time = timeShift,
      GAP: number,
      TIME_DELTA: number,
      COLOR_INDEX: number,
      CURVES_COUNT: number,
      TRACE_FACTOR: number,
      DISPERSION: number,
      NOISE_FACTOR: number;

    p.updateWithProps = (props) => {
      TIME_DELTA = props.TIME_DELTA;
      COLOR_INDEX = props.COLOR;
      GAP = props.GAP;
      CURVES_COUNT = props.CURVES_COUNT;
      TRACE_FACTOR = props.TRACE_FACTOR;
      FRACTURE_FREQUENCY.value = props.FRACTURE_FREQUENCY;
      DISPERSION = props.DISPERSION;
      NOISE_FACTOR = props.NOISE_FACTOR;

      if (FRACTURE_FREQUENCY.hasChanged) {
        updateYCoords();
      }

      if (props.playing) {
        p.loop();
      } else {
        p.noLoop();
      }
    };

    function updateYCoords() {
      const newLen = FRACTURE_FREQUENCY.value! + 2;
      if (Y_COORDS.length !== newLen) {
        Y_COORDS = range(newLen).map(() => new AnimatedValue(SPEED));
      }

      Y_COORDS.forEach((y, i) => {
        const nextValue = p.map(
          p.noise(i, time * NOISE_FACTOR),
          0,
          1,
          (HEIGHT / 2) * (1 - DISPERSION),
          (HEIGHT / 2) * (1 + DISPERSION)
        );
        y.animateTo(nextValue);
      });
    }

    function drawLines() {
      // const color = p.lerpColor(
      //   p.color("rgba(52, 9, 152, 1)"),
      //   p.color("rgba(234, 114, 247, 1)"),
      //   j / INDEPENDENT_CURVES_COUNT
      // );
      const twinMidIndex = Math.round((CURVES_COUNT - 1) / 2);

      for (let t = -twinMidIndex; t <= twinMidIndex; t++) {
        const yOffset = t * GAP;
        const alpha =
          t === 0 ? 255 : p.map(p.abs(t), 0, twinMidIndex + 1, 20, 0);

        const color = p.color(controls.COLOR.colors[COLOR_INDEX][0]);
        color.setAlpha(alpha);
        p.stroke(color);

        p.beginShape();
        Y_COORDS.forEach((animatedY, i, arr) => {
          const x = (WIDTH * (i - 1)) / (arr.length - 3);
          const y = animatedY.getCurrentValue()! + yOffset;
          // p.circle(x, y, 10);
          p.curveVertex(x, y);
        });
        p.endShape();
      }

      Y_COORDS.forEach((y) => y.nextStep());
    }

    p.setup = () => {
      p.createCanvas(WIDTH, HEIGHT);
      p.strokeWeight(2);
      p.randomSeed(randomSeed);
      p.noiseSeed(randomSeed);
      p.background("black");
    };

    p.draw = () => {
      time += TIME_DELTA;

      if (time % SPEED === 0) {
        updateYCoords();
      }

      p.noStroke();
      const OPACITY = p.map(TRACE_FACTOR, 0, 100, 100, 5);
      p.background(p.color(0, 0, 0, OPACITY));
      p.noFill();

      drawLines();
    };
  };

const presets: IPreset<Params>[] = [
  {
    params: {
      CURVES_COUNT: 35,
      GAP: 20,
      TIME_DELTA: 1,
      FRACTURE_FREQUENCY: 20,
      COLOR: 0,
      TRACE_FACTOR: 80,
      DISPERSION: 0.3,
      NOISE_FACTOR: 0.001,
    },
  },
];

export const pulseSketch: ISketch<Params> = {
  factory,
  id: "pulse",
  name: "pulse",
  preview: {
    size: 520,
  },
  timeShift: 290,
  randomSeed: 44,
  controls,
  presets,
  defaultParams: presets[0].params,
};
