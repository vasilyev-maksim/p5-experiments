import type { IControls, IPreset, ISketch } from "../../models";
import { AnimatedValue } from "@core/AnimatedValue";
import { createSketch } from "@core/createSketch";

export type Controls = typeof controls;

const controls = {
  TIME_DELTA: {
    type: "range",
    min: 0,
    max: 3,
    step: 0.1,
    label: "Playback speed",
    valueFormatter: (x) => x.toFixed(1),
  },
} as const satisfies IControls;

export const factory = createSketch<typeof controls>(() => {
  const animatedX = new AnimatedValue(0, 20);
  const animatedY = new AnimatedValue(0, 20);
  return {
    setup: ({ p, getTime }) => {
      p.noStroke();

      p.mouseClicked = () => {
        const currentTime = getTime();
        animatedX.animateTo({ value: p.mouseX, currentTime });
        animatedY.animateTo({ value: p.mouseY, currentTime });
      };
    },
    draw: ({ p, getTime }) => {
      return () => {
        p.background("black");
        p.stroke("white");
        const time = getTime();
        p.circle(
          animatedX.getCurrentValue(time),
          animatedY.getCurrentValue(time),
          10,
        );
      };
    },
  };
});

const presets: IPreset<Controls>[] = [
  {
    params: {
      TIME_DELTA: 1,
    },
    timeDelta: 1,
  },
];

export const interpolationSketch: ISketch<Controls> = {
  factory,
  id: "interpolation",
  name: "interpolation",
  preview: {
    size: 520,
  },
  randomSeed: 44,
  controls,
  presets,
  type: "hidden",
};
