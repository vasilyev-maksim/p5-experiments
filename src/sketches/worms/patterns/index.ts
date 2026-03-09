import type { OccupancyGrid } from "@/utils/OccupancyGrid";
import type { P5CanvasInstance } from "@p5-wrapper/react";
import { randomDirectionalPattern } from "./randomDir";
import { snailPattern } from "./snail";
import { mirrorPattern } from "./mirror";
import type { RandomProvider } from "@/core/models";
import { directionalPattern } from "./dir";
import { ringPattern } from "./ring";

export type PatternArgs = {
  p: P5CanvasInstance;
  occupancyGrid: OccupancyGrid;
  resX: number;
  resY: number;
  len: number;
  randomProvider: RandomProvider;
};

export const patterns = [
  randomDirectionalPattern,
  directionalPattern({
    directionX: 0.44,
    directionY: 0.11,
  }),
  snailPattern,
  mirrorPattern,
  ringPattern({
    inverted: false,
    innerRadius: 0.2,
    outerRadius: 0.7,
    attractorX: 0.5,
    attractorY: 0.5,
  }),
  ringPattern({
    inverted: true,
    innerRadius: 0.3,
    outerRadius: 0.7,
    attractorX: 0.5,
    attractorY: 0.5,
  }),
] as const;

export const patternNames = patterns.map((_, i) => "#" + (i + 1));
