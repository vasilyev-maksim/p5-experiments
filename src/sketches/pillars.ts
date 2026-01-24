import { createSketch } from "./utils/createSketch";
import type {
  ExtractParams,
  IControls,
  IPreset,
  ISketch,
  ISketchFactory,
} from "../models";
import type p5 from "p5";
import { AnimatedValue } from "./utils/AnimatedValue";

const controls = {
  RESOLUTION: {
    label: "Pillars count",
    max: 20,
    min: 1,
    step: 1,
    type: "range",
  },
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
  W_DISPERSION: {
    label: "Pillar width dispersion",
    max: 0.8,
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
    ],
    label: "Color",
  },
} as const satisfies IControls;

type Params = ExtractParams<typeof controls>;

const factory: ISketchFactory<Params> = createSketch<Params>(
  (p, getProp, _getTime, createMemoizedValue) => {
    // let animatedParts: AnimatedValue[] = [];
    const PARTS = createMemoizedValue(
      (resolution: number, dispersion: number) => {
        console.log(resolution, dispersion, "recalc");
        const parts = getRandomPartition(p, resolution, dispersion);
        // if (!animatedParts) {
        //   animatedParts = parts.map((x) => new AnimatedValue(10, x));
        // }
        // parts.forEach((x, i) => {
        //   animatedParts[i].animateTo(x);
        // });
        return parts;
      },
      [getProp("RESOLUTION"), getProp("W_DISPERSION")]
    );

    function drawColumn(
      x: number,
      y: number,
      w: number,
      h: number,
      gapY: number,
      gapHeight: number
    ) {
      const gd = gapHeight / 2;
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
      const COLOR = getProp("COLOR").value;
      const color = p.lerpColor(
        p.color(controls.COLOR.colors[COLOR][0]),
        p.color(controls.COLOR.colors[COLOR][1]),
        h / p.height
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

    return {
      setup: () => {
        p.noStroke();
      },
      draw: (time) => {
        const GAP_X = (getProp("GAP_X").value * p.width) / 1158,
          GAP_Y = (getProp("GAP_Y").value * p.height) / 811,
          AMPLITUDE = getProp("AMPLITUDE").value,
          PERIOD = getProp("PERIOD").value;

        p.background("black");

        const totalWidth = p.width - GAP_X;
        let start = GAP_X;

        PARTS.value.forEach((_w, i, { length }) => {
          const x = start,
            y = 0,
            widthNormalized = _w,
            // widthNormalized = animatedWidthNormalized.getCurrentValue()!,
            w = widthNormalized * totalWidth - GAP_X,
            h = p.height,
            gapX =
              p.height / 2 +
              p.map(
                AMPLITUDE,
                controls.AMPLITUDE.min,
                controls.AMPLITUDE.max,
                0,
                p.height / 2
              ) *
                p.sin((p.TWO_PI * PERIOD * i) / length + time * 0.015);

          drawColumn(x, y, w, h, gapX, GAP_Y);
          start += widthNormalized * totalWidth;

          // animatedWidthNormalized.nextStep();
        });
      },
    };
  }
);

export function getRandomPartition(
  p: p5,
  partsCount: number,
  dispersion: number
): number[] {
  if (dispersion < 0 || dispersion > 1) {
    throw Error(
      `Invalid dispersion value "${dispersion}", should be < 0 and > 1`
    );
  }

  const min = (1 - dispersion) / partsCount;
  const max = (1 + dispersion) / partsCount;

  function r(n: number, remainder: number): number[] {
    if (n <= 1) {
      return [remainder];
    }

    const _max = Math.min(max, remainder - min * (n - 1));
    if (min - _max > 0.00001) {
      throw Error(
        `No sufficient range left for partition (for n = ${n}, reminder = ${remainder}, min = ${min}, _max = ${_max})`
      );
    }
    const curr = p.map(p.random(), 0, 1, min, _max);

    return [curr, ...r(n - 1, remainder - curr)];
  }

  const res = r(partsCount, 1);
  return res;
}

const presets: IPreset<Params>[] = [
  {
    params: {
      RESOLUTION: 15,
      AMPLITUDE: 6,
      PERIOD: 1,
      GAP_X: 6,
      GAP_Y: 6,
      W_DISPERSION: 0.5,
      COLOR: 0,
      timeDelta: 1,
    },
    name: "looks uneven",
  },
  {
    params: {
      RESOLUTION: 25,
      AMPLITUDE: 1,
      PERIOD: 2,
      GAP_X: 1,
      GAP_Y: 200,
      W_DISPERSION: 0,
      COLOR: 1,
      timeDelta: 3,
    },
    name: "dragon",
  },
  {
    params: {
      RESOLUTION: 5,
      AMPLITUDE: 7,
      PERIOD: 1,
      GAP_X: 25,
      GAP_Y: 25,
      W_DISPERSION: 0.3,
      COLOR: 0,
      timeDelta: 0.3,
    },
    name: "lava lamp",
  },
  {
    params: {
      RESOLUTION: 25,
      AMPLITUDE: 10,
      PERIOD: 1,
      GAP_X: 8,
      GAP_Y: 8,
      W_DISPERSION: 0,
      COLOR: 2,
      timeDelta: 3,
    },
    name: "wave",
  },
  {
    params: {
      RESOLUTION: 25,
      AMPLITUDE: 10,
      PERIOD: 4,
      GAP_X: 23,
      GAP_Y: 25,
      W_DISPERSION: 0,
      COLOR: 0,
      timeDelta: 0.3,
    },
    name: "rush hour",
  },
  {
    params: {
      RESOLUTION: 6,
      AMPLITUDE: 10,
      PERIOD: 3,
      GAP_X: 10,
      GAP_Y: 12,
      W_DISPERSION: 0,
      COLOR: 3,
      timeDelta: 1,
    },
    name: "piano",
  },
  {
    params: {
      RESOLUTION: 25,
      AMPLITUDE: 1,
      PERIOD: 1,
      GAP_X: 10,
      GAP_Y: 35,
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
    size: 390,
  },
  timeShift: 25.5,
  randomSeed: 144,
  controls,
  presets,
  defaultParams: presets[0].params,
};
