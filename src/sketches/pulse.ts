import type {
  ExtractParams,
  IControls,
  IPreset,
  ISketch,
  ISketchFactory,
} from "../models";
import { range, ValueWithHistory } from "../utils";

const controls = {
  CURVE_RESOLUTION: {
    label: "Curve resolution",
    max: 100,
    min: 5,
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
  GAP: {
    label: "Gap",
    max: 50,
    min: 10,
    step: 1,
    type: "range",
  },
  CHAOS_FACTOR: {
    label: "Chaos factor",
    max: 100,
    min: 0,
    step: 1,
    type: "range",
    valueFormatter: (x) => x + "%",
  },
  DISPERSION: {
    label: "Dispersion",
    max: 1,
    min: 0,
    step: 0.05,
    type: "range",
    valueFormatter: (x) => x.toFixed(2),
  },
  TRACE_FACTOR: {
    label: "Trace factor",
    max: 100,
    min: 0,
    step: 1,
    type: "range",
    valueFormatter: (x) => x + "%",
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
    const CURVE_RESOLUTION = new ValueWithHistory<number>();
    const TIME_DELTA: number = 1;

    let Y_COORDS: number[] = [];

    let time = timeShift,
      GAP: number,
      COLOR_INDEX: number,
      CURVES_COUNT: number,
      TRACE_FACTOR: number,
      DISPERSION: number,
      CHAOS_FACTOR: number;

    p.updateWithProps = (props) => {
      COLOR_INDEX = props.COLOR;
      GAP = props.GAP;
      CURVES_COUNT = props.CURVES_COUNT;
      TRACE_FACTOR = props.TRACE_FACTOR;
      CURVE_RESOLUTION.value = props.CURVE_RESOLUTION;
      DISPERSION = props.DISPERSION;
      CHAOS_FACTOR = props.CHAOS_FACTOR;

      if (CURVE_RESOLUTION.hasChanged) {
        updateYCoords();
      }

      if (props.playing) {
        p.loop();
      } else {
        p.noLoop();
      }
    };

    function updateYCoords() {
      const NOISE_DELTA = p.map(CHAOS_FACTOR, 0, 100, 0.001, 0.05);
      Y_COORDS = range(CURVE_RESOLUTION.value! + 2).map((i) =>
        p.map(
          p.noise(i, time * NOISE_DELTA),
          0,
          1,
          (HEIGHT / 2) * (1 - DISPERSION),
          (HEIGHT / 2) * (1 + DISPERSION)
        )
      );
    }

    function drawLines() {
      const twinMidIndex = Math.round((CURVES_COUNT - 1) / 2);

      for (let t = -twinMidIndex; t <= twinMidIndex; t++) {
        const yOffset = t * GAP;
        const alpha =
          t === 0 ? 255 : p.map(p.abs(t), 0, twinMidIndex + 1, 20, 0);

        const color = p.color(controls.COLOR.colors[COLOR_INDEX][0]);
        color.setAlpha(alpha);
        p.stroke(color);

        p.beginShape();
        Y_COORDS.forEach((_y, i, arr) => {
          const x = (WIDTH * (i - 1)) / (arr.length - 3);
          const y = _y + yOffset;
          // p.circle(x, y, 6);
          // p.rect(x - 3, y - 3, 6, 6);
          p.curveVertex(x, y);
        });
        p.endShape();
      }
    }

    p.setup = () => {
      p.createCanvas(WIDTH, HEIGHT);
      p.strokeWeight(2);
      p.randomSeed(randomSeed);
      p.noiseSeed(randomSeed);
      p.background("black");
    };

    p.draw = () => {
      p.noStroke();
      const OPACITY = p.map(TRACE_FACTOR, 0, 100, 100, 5);
      p.background(p.color(0, 0, 0, OPACITY));
      p.noFill();

      drawLines();
      updateYCoords();
      time += TIME_DELTA;
    };
  };

const presets: IPreset<Params>[] = [
  {
    params: {
      CURVES_COUNT: 37,
      GAP: 22,
      CURVE_RESOLUTION: 23,
      COLOR: 0,
      TRACE_FACTOR: 80,
      DISPERSION: 0.2,
      CHAOS_FACTOR: 3,
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
  timeShift: 0,
  randomSeed: 44,
  controls,
  presets,
  defaultParams: presets[0].params,
};
