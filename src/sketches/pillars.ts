import { getRandomPartition } from "./utils";
import type {
  ExtractParams,
  IControls,
  ISketch,
  ISketchFactory,
} from "../models";
import { ValueWithHistory } from "../utils";

const controls = {
  AMPLITUDE: {
    label: "Wave amplitude",
    max: 10,
    min: 0,
    step: 1,
    type: "range",
    defaultValue: 5,
  },
  GAP_X: {
    label: "Horizontal gap",
    max: 30,
    min: 0,
    step: 1,
    type: "range",
    defaultValue: 6,
  },
  GAP_Y: {
    label: "Vertical gap",
    max: 200,
    min: 1,
    step: 1,
    type: "range",
    defaultValue: 6,
  },
  W_MEAN: {
    label: "Pillar width average",
    max: 10,
    min: 1,
    step: 1,
    type: "range",
    defaultValue: 2,
  },
  W_DISPERSION: {
    label: "Pillar width dispersion",
    max: 1,
    min: 0,
    step: 0.1,
    type: "range",
    defaultValue: 0.5,
    valueFormatter: (x) => x.toFixed(1),
  },
  TIME_DELTA: {
    type: "range",
    min: -3,
    max: 3,
    defaultValue: 1,
    step: 0.1,
    label: "Playback speed",
    valueFormatter: (x) => x.toFixed(1),
  },
} as const satisfies IControls;

type Params = ExtractParams<typeof controls>;

const factory: ISketchFactory<Params> =
  (WIDTH, HEIGHT, randomSeed, timeShift) => (p) => {
    const W_MEAN_RANGE = [WIDTH / 25, WIDTH / 3],
      W_MIN = 15,
      W_MEAN = new ValueWithHistory<number>(controls.W_MEAN.defaultValue),
      W_DISPERSION = new ValueWithHistory<number>(
        controls.W_DISPERSION.defaultValue
      );

    let PARTS: number[];
    let time = timeShift,
      GAP_X: number = controls.GAP_X.defaultValue,
      GAP_Y: number = controls.GAP_Y.defaultValue,
      TIME_DELTA: number = controls.TIME_DELTA.defaultValue,
      AMPLITUDE: number = controls.AMPLITUDE.defaultValue;

    p.updateWithProps = (props) => {
      TIME_DELTA = props.TIME_DELTA;
      AMPLITUDE = props.AMPLITUDE;
      GAP_X = props.GAP_X;
      GAP_Y = props.GAP_Y;
      W_MEAN.value = props.W_MEAN;
      W_DISPERSION.value = props.W_DISPERSION;
      console.log(W_MEAN, W_DISPERSION);

      if (W_MEAN.hasChanged || W_DISPERSION.hasChanged) {
        initParts();
      }

      if (props.playing) {
        p.loop();
      } else {
        p.noLoop();
      }
    };

    p.setup = () => {
      p.createCanvas(WIDTH, HEIGHT);
      p.noStroke();
      p.randomSeed(randomSeed);
      initParts();
    };

    p.draw = () => {
      time += TIME_DELTA;

      p.background("black");

      const totalWidth = PARTS.reduce((acc, x) => acc + x, 0) - GAP_X;
      let start = (WIDTH - totalWidth) / 2;

      PARTS.forEach((w, i) => {
        drawColumn(
          start,
          0,
          w - GAP_X,
          HEIGHT,
          HEIGHT / 2 +
            p.map(
              AMPLITUDE,
              controls.AMPLITUDE.min,
              controls.AMPLITUDE.max,
              0,
              HEIGHT / 2
            ) *
              p.sin((p.PI * i * 2) / PARTS.length + p.PI * time * 0.005),
          GAP_Y
        );
        start += w;
      });

      function drawColumn(
        x: number,
        y: number,
        w: number,
        h: number,
        gapY: number,
        gapH: number
      ) {
        const gd = gapH / 2;
        drawPill(x, y, w, gapY - gd, "down");
        drawPill(x, gapY + gd, w, h - gapY + gd, "up");
      }

      function drawPill(
        x: number,
        y: number,
        w: number,
        h: number,
        direction: "up" | "down"
      ) {
        const color = p.lerpColor(
          p.color("rgba(52, 9, 152, 1)"),
          p.color("rgba(234, 114, 247, 1)"),
          h / HEIGHT
        );

        p.fill(color);

        const tl = p.createVector(x, y);
        const r = w / 2,
          c = tl
            .copy()
            .add(
              p.createVector(...(direction === "up" ? [r, r] : [w - r, h - r]))
            );
        p.circle(c.x, c.y, r * 2);

        const rtl =
          direction === "up" ? tl.copy().add(p.createVector(0, r)) : tl;
        p.rect(rtl.x, rtl.y, w, Math.max(h - r, 0));
      }
    };

    function initParts() {
      const mean = p.map(
        W_MEAN.value,
        controls.W_MEAN.min,
        controls.W_MEAN.max,
        W_MEAN_RANGE[0],
        W_MEAN_RANGE[1]
      );
      const min = Math.max(mean * (1 - W_DISPERSION.value), W_MIN);
      const max = Math.max(mean * (1 + W_DISPERSION.value), W_MIN);
      PARTS = getRandomPartition(WIDTH, min, max, () => p.random()).filter(
        (x) => x >= W_MIN + GAP_X
      );
      console.log({ PARTS, min, max });
    }
  };

export const pillarsSketch: ISketch<Params> = {
  factory,
  id: "pillars",
  name: "pillars",
  preview: {
    size: 420,
  },
  timeShift: 10,
  randomSeed: 44,
  controls,
  // presets,
};
