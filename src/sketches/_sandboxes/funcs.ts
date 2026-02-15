// import { oscillateBetween } from "@/core/utils";
import type { IControls, IPreset, ISketch } from "../../models";
import { createSketch } from "@core/createSketch";
import { range } from "@/utils/misc";

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
    max: 10,
    step: 1,
    label: "Speed",
  },
} as const satisfies IControls;

const presets: IPreset<Controls>[] = [
  {
    params: {
      RESOLUTION: 100,
      SPEED: 1,
    },
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

        const fn = (x: number) => p.sin(x * p.HALF_PI);
        // const fn = (x: number) => x ** 3;
        // const fn = (x: number) => p.sin(p.PI * x);

        p.fill("red");

        p.beginShape();

        let y = 0;

        range(res + 1).forEach((i) => {
          const delta = 2 / res;
          const timeShift = (time * speed) / 40;
          const x = -1 + i * delta;
          y = -fn(x + timeShift);
          y = p.constrain(y, -1, 1);

          p.vertex(x, y);
        });
        p.vertex(1, y);
        p.vertex(1, 1);
        p.vertex(-1, 1);

        p.endShape("close");
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
