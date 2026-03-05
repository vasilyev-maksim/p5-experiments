import type { OccupancyGrid } from "@/utils/OccupancyGrid";
import type { P5CanvasInstance } from "@p5-wrapper/react";
import { randomPattern } from "./random";
import { snailPattern } from "./snail";
import { mirrorPattern } from "./mirror";
import type { RandomProvider } from "@/core/models";
import type { RelDirMap } from "@/sketches/utils";
import { random2Pattern } from "./random2";

export type PatternArgs = {
  p: P5CanvasInstance;
  matrix: OccupancyGrid;
  resX: number;
  resY: number;
  len: number;
  randomProvider: RandomProvider;
  dirWeights: RelDirMap<number>;
};

export const patterns = [
  {
    name: "random",
    pattern: randomPattern,
  },
  {
    name: "random2",
    pattern: random2Pattern,
  },
  {
    name: "snail",
    pattern: snailPattern,
  },
  {
    name: "mirror",
    pattern: mirrorPattern,
  },
] as const;

export const patternNames = patterns.map((_, i) => "#" + (i + 1));
