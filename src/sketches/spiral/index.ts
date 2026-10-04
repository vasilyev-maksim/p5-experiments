import type { ISketch } from "../../models";
import { controls, type Controls } from "./controls";
import { factory } from "./factory";
import { presets } from "./presets";

// let abortController: AbortController;

export const sketch: ISketch<Controls> = {
  factory,
  id: "spiral",
  name: "spiral",
  preview: {
    sizeInPercents: 44,
  },
  controls,
  presets,
  type: "released",
  scenarios: [
    {
      name: "test",
      fn: function* () {
        yield {
          type: "sketchEvent",
          event: {
            type: "applyPreset",
            preset: {
              ...presets.find((x) => x.name === "spiral")!,
              timeDelta: 1.5,
            },
          },
        };
        yield { type: "delay", duration: 4000 };
        yield {
          type: "sketchEvent",
          event: {
            type: "applyPreset",
            preset: {
              ...presets.find((x) => x.name === "whirlpool")!,
              timeDelta: 1,
            },
          },
        };
        yield { type: "delay", duration: 2500 };
        yield {
          type: "sketchEvent",
          event: {
            type: "applyPreset",
            preset: presets.find((x) => x.name === "mandala")!,
          },
        };
        yield { type: "delay", duration: 3000 };
        yield {
          type: "sketchEvent",
          event: {
            type: "applyPreset",
            preset: {
              ...presets.find((x) => x.name === "radiation")!,
              timeDelta: 1.5,
              startTime: 800,
            },
          },
        };
        yield { type: "delay", duration: 3000 };
        yield {
          type: "sketchEvent",
          event: {
            type: "applyPreset",
            preset: presets.find((x) => x.name === "purple lambo")!,
          },
        };
        yield { type: "delay", duration: 3000 };
        yield {
          type: "sketchEvent",
          event: {
            type: "applyPreset",
            preset: presets.find((x) => x.name === "spiderverse")!,
          },
        };
      },
    },
  ],
};
