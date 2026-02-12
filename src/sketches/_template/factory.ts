import { createSketch } from "@/core/createSketch";
import type { Controls } from "./controls";

export const factory = createSketch<Controls>(({ p }) => {
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
