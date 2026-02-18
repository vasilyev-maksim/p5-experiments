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
        const startTime = getTime();
        animatedX.animateTo({ value: p.mouseX, startTime });
        animatedY.animateTo({ value: p.mouseY, startTime });
      };
    },
    draw: ({ p, getTime }) => {
      return () => {
        p.background("black");
        p.stroke("white");
        const time = getTime();
        p.circle(
          animatedX.getCurrentValue()!,
          animatedY.getCurrentValue()!,
          10,
        );
        animatedX.runAnimationStep(time);
        animatedY.runAnimationStep(time);
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
