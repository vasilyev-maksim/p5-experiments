import { createSketch } from "@/core/createSketch";
import type { Controls } from "./controls";

export const factory = createSketch<Controls>(({ p }) => {
  return {
    setup: () => {
      p.noStroke();
    },
    draw: () => {
      p.background("black");
      p.stroke("white");
    },
  };
});
