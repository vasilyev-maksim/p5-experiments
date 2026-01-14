import { createFactory, getRandomPartition } from "./utils";
import type {
  ExtractParams,
  IControls,
  IPreset,
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
  },
  PERIOD: {
    label: "Wave period",
    max: 4,
    min: 1,
    step: 1,
    type: "range",
  },
  GAP_X: {
    label: "Horizontal gap",
    max: 30,
    min: 0,
    step: 1,
    type: "range",
  },
  GAP_Y: {
    label: "Vertical gap",
    max: 200,
    min: 1,
    step: 1,
    type: "range",
  },
  W_MEAN: {
    label: "Pillar width average",
    max: 10,
    min: 1,
    step: 1,
    type: "range",
  },
  W_DISPERSION: {
    label: "Pillar width dispersion",
    max: 1,
    min: 0,
    step: 0.1,
    type: "range",
    valueFormatter: (x) => x.toFixed(1),
  },
  COLOR: {
    type: "color",
    colors: [
      ["#340998ff", "#ea72f7ff"],
      ["#ff4b4bff", "#f0f689ff"],
      ["#13005fff", "#a3ff9aff"],
      ["#000", "#ffffffff"],
      // ["#003e49ff", "#8aee98ff"],
    ],
    label: "Color",
  },
} as const satisfies IControls;

type Params = ExtractParams<typeof controls>;

const factory: ISketchFactory<Params> = createFactory<Params>(
  (p, { canvasHeight, canvasWidth }, getProp) => {
    const W_MEAN_RANGE = [canvasWidth / 25, canvasHeight / 3],
      W_MIN = 15,
      W_MEAN = new ValueWithHistory<number>(),
      W_DISPERSION = new ValueWithHistory<number>();

    let PARTS: number[];

    p.setup = () => {};

    function drawColumn(
      x: number,
      y: number,
      w: number,
      h: number,
      gapY: number,
      gapH: number
    ) {
      const gd = gapH / 2;
      drawPill(x, y, w, gapY - gd, "down", "circle");
      drawPill(x, gapY + gd, w, h - gapY + gd, "up", "circle");
    }

    function drawPill(
      x: number,
      y: number,
      w: number,
      h: number,
      direction: "up" | "down",
      endStyle: "circle" | "polygon"
    ) {
      const COLOR = getProp("COLOR");
      const color = p.lerpColor(
        p.color(controls.COLOR.colors[COLOR][0]),
        p.color(controls.COLOR.colors[COLOR][1]),
        h / canvasHeight
      );

      p.fill(color);

      const tl = p.createVector(x, y);
      const r = w / 2;
      const c = tl
        .copy()
        .add(p.createVector(...(direction === "up" ? [r, r] : [w - r, h - r])));
      switch (endStyle) {
        default:
        case "circle":
          p.circle(c.x, c.y, r * 2);
          break;
        case "polygon":
          p.push();
          {
            p.translate(c.x, c.y);
            p.beginShape();
            for (let a = 0; a <= p.PI; a += p.PI / 3) {
              const sx = p.cos(a) * r;
              const sy = p.sin(a) * r * (direction === "up" ? -1 : 1);
              p.vertex(sx, sy);
            }
            p.endShape("close");
          }
          p.pop();
          break;
      }

      const rtl = direction === "up" ? tl.copy().add(p.createVector(0, r)) : tl;
      p.rect(rtl.x, rtl.y, w, Math.max(h - r, 0));
    }

    function initParts() {
      const GAP_X = getProp("GAP_X");
      const mean = p.map(
        W_MEAN.value!,
        controls.W_MEAN.min,
        controls.W_MEAN.max,
        W_MEAN_RANGE[0],
        W_MEAN_RANGE[1]
      );
      const min = Math.max(mean * (1 - W_DISPERSION.value!), W_MIN);
      const max = Math.max(mean * (1 + W_DISPERSION.value!), W_MIN);
      PARTS = getRandomPartition(canvasWidth, min, max, () =>
        p.random()
      ).filter((x) => x >= W_MIN + GAP_X);
    }

    return {
      updateWithProps: (props) => {
        W_MEAN.value = props.W_MEAN;
        W_DISPERSION.value = props.W_DISPERSION;

        if (W_MEAN.hasChanged || W_DISPERSION.hasChanged) {
          initParts();
        }
      },
      setup: () => p.noStroke(),
      draw: (time) => {
        const GAP_X = getProp("GAP_X"),
          GAP_Y = getProp("GAP_Y"),
          AMPLITUDE = getProp("AMPLITUDE"),
          PERIOD = getProp("PERIOD");

        p.background("black");

        const totalWidth = PARTS.reduce((acc, x) => acc + x, 0) - GAP_X;
        let start = (canvasWidth - totalWidth) / 2;

        PARTS.forEach((_w, i) => {
          const x = start,
            y = 0,
            w = _w - GAP_X,
            h = canvasHeight,
            gapX =
              canvasHeight / 2 +
              p.map(
                AMPLITUDE,
                controls.AMPLITUDE.min,
                controls.AMPLITUDE.max,
                0,
                canvasHeight / 2
              ) *
                p.sin((p.TWO_PI * PERIOD * i) / PARTS.length + time * 0.015);

          drawColumn(x, y, w, h, gapX, GAP_Y);
          start += _w;
        });
      },
    };
  }
);

const presets: IPreset<Params>[] = [
  {
    params: {
      AMPLITUDE: 6,
      PERIOD: 1,
      GAP_X: 6,
      GAP_Y: 6,
      W_MEAN: 2,
      W_DISPERSION: 0.5,
      COLOR: 0,
      timeDelta: 1,
    },
    name: "looks uneven",
  },
  {
    params: {
      AMPLITUDE: 1,
      PERIOD: 2,
      GAP_X: 1,
      GAP_Y: 200,
      W_MEAN: 1,
      W_DISPERSION: 0,
      COLOR: 1,
      timeDelta: 3,
    },
    name: "dragon",
  },
  {
    params: {
      AMPLITUDE: 7,
      PERIOD: 1,
      GAP_X: 25,
      GAP_Y: 25,
      W_MEAN: 8,
      W_DISPERSION: 0.3,
      COLOR: 0,
      timeDelta: 0.3,
    },
    name: "lava lamp",
  },
  {
    params: {
      AMPLITUDE: 10,
      PERIOD: 1,
      GAP_X: 8,
      GAP_Y: 8,
      W_MEAN: 1,
      W_DISPERSION: 0,
      COLOR: 2,
      timeDelta: 3,
    },
    name: "wave",
  },
  {
    params: {
      AMPLITUDE: 10,
      PERIOD: 4,
      GAP_X: 23,
      GAP_Y: 25,
      W_MEAN: 1,
      W_DISPERSION: 0,
      COLOR: 0,
      timeDelta: 0.3,
    },
    name: "rush hour",
  },
  {
    params: {
      AMPLITUDE: 10,
      PERIOD: 3,
      GAP_X: 10,
      GAP_Y: 12,
      W_MEAN: 5,
      W_DISPERSION: 0,
      COLOR: 3,
      timeDelta: 1,
    },
    name: "piano",
  },
  {
    params: {
      AMPLITUDE: 1,
      PERIOD: 1,
      GAP_X: 10,
      GAP_Y: 35,
      W_MEAN: 1,
      W_DISPERSION: 0,
      COLOR: 1,
      timeDelta: 0.8,
    },
    name: "scoliosis",
  },
];

export const pillarsSketch: ISketch<Params> = {
  factory,
  id: "pillars",
  name: "pillars",
  preview: {
    size: 420,
  },
  timeShift: 25.5,
  randomSeed: 44,
  controls,
  presets,
  defaultParams: presets[0].params,
};
