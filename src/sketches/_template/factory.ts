import { createSketch } from "@/core/createSketch";
import type { ISketchFactory } from "@/models";
import type { Params } from ".";

export const factory: ISketchFactory<Params> = createSketch<Params>(() => {
  return {
    setup: ({ p }) => {
      p.noStroke();
    },
    draw: ({ p }) => {
      return () => {
        p.background("black");
        p.stroke("white");
      };
    },
  };
});
