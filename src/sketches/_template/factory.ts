import { createSketch } from "@/core/createSketch";
import type { ISketchFactory } from "@/models";
import type { Params } from ".";

export const factory: ISketchFactory<Params> = createSketch<Params>(({ p }) => {
  return {
    setup: () => {
      p.noStroke();
    },
    draw: () => {
      return () => {
        p.background("black");
        p.stroke("white");
      };
    },
  };
});
