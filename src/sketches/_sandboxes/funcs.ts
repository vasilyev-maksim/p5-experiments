// import { oscillateBetween } from "@/core/utils";
import type { IControls, IPreset, ISketch } from "../../models";
import { createSketch } from "@core/createSketch";
import { range } from "@/utils/misc";
import { flatSin } from "@/core/utils";

export type Controls = typeof controls;

const controls = {
  RESOLUTION: {
    type: "range",
    min: 3,
    max: 100,
    step: 1,
    label: "Resolution",
  },
  SPEED: {
    type: "range",
    min: 0,
    max: 5,
    step: 0.1,
    label: "Speed",
    valueFormatter: (x) => x.toFixed(1),
  },
  OUTER_OFFSET: {
    type: "range",
    min: 0,
    max: 0.5,
    step: 0.05,
    label: "Outer offset",
    valueFormatter: (x) => x.toFixed(2),
  },
  MIDDLE_OFFSET: {
    type: "range",
    min: 0,
    max: 0.5,
    step: 0.05,
    label: "Middle offset",
    valueFormatter: (x) => x.toFixed(2),
  },
  INNER_OFFSET: {
    type: "range",
    min: 0,
    max: 0.5,
    step: 0.05,
    label: "Inner offset",
    valueFormatter: (x) => x.toFixed(2),
  },
} as const satisfies IControls;

const presets: IPreset<Controls>[] = [
  {
    params: {
      RESOLUTION: 100,
      SPEED: 1,
      OUTER_OFFSET: 0.1,
      MIDDLE_OFFSET: 0.05,
      INNER_OFFSET: 0.1,
    },
    timeDelta: 1,
  },
];

export const factory = createSketch<Controls>(({ p, getProp, getTime }) => {
  return {
    setup: () => {
      p.background("black");
    },
    draw: () => {
      return () => {
        p.background("black");
        p.stroke("white");
        p.translate(p.width / 2, p.height / 2);
        const min = p.min(p.width, p.height);
        const abs = (x: number) => x / min;

        const PADDING = 0.3;
        p.scale(min / 2, min / 2);
        p.scale(1 - PADDING);
        p.strokeWeight(abs(15));
        p.strokeJoin("round");
        p.fill("blue");

        p.rect(-1, -1, 2, 2);

        const time = getTime();
        const res = getProp("RESOLUTION");
        const speed = getProp("SPEED");

        // const fn = (x: number) => x ** 3;
        // const fn = (x: number) => p.sin(x * p.HALF_PI);
        // const fn = (x: number) => p.sin(p.PI * x);
        const fn = flatSin(
          p,
          getProp("OUTER_OFFSET"),
          getProp("MIDDLE_OFFSET"),
          getProp("INNER_OFFSET"),
        );

        p.fill("red");

        p.beginShape();

        let y = 0;

        range(res + 1).forEach((i) => {
          const delta = 2 / res;
          const timeShift = (time * speed) / 80;
          const x = -1 + i * delta;
          y = fn(x + timeShift);
          y = p.constrain(y, -1, 1);

          p.vertex(x, y);
        });
        p.vertex(1, y);
        p.vertex(1, 1);
        p.vertex(-1, 1);

        p.endShape("close");

        p.circle(-1.2, y, abs(50));
      };
    },
  };
});

export const sketch: ISketch<Controls> = {
  factory,
  id: "funcs",
  name: "funcs",
  preview: {
    size: 600,
  },
  randomSeed: 44,
  controls,
  presets,
  type: "draft",
};
