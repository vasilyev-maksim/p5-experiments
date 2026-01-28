import type {
  ExtractParams,
  IControls,
  IPreset,
  ISketch,
  ISketchFactory,
} from "../models";
import { createSketch } from "./utils/createSketch";

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

type Params = ExtractParams<typeof controls>;

export const factory: ISketchFactory<Params> = createSketch<Params>(() => {
  return {
    setup: ({ p }) => {
      p.noStroke();
    },
    drawFactory: ({ p }) => {
      return () => {
        p.background("black");
        p.stroke("white");
      };
    },
  };
});

const presets: IPreset<Params>[] = [
  {
    params: {
      TIME_DELTA: 1,
    },
  },
];

export const testSketch: ISketch<Params> = {
  factory,
  id: "test",
  name: "test",
  preview: {
    size: 520,
  },
  timeShift: 0,
  randomSeed: 44,
  controls,
  presets,
  defaultParams: presets[0].params,
};
