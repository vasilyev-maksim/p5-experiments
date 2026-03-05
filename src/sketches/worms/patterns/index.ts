import type { OccupancyGrid } from "@/utils/OccupancyGrid";
import type { P5CanvasInstance } from "@p5-wrapper/react";
import { randomPattern } from "./random";
import { snailPattern } from "./snail";
import { spotlightPattern } from "./spotlight";
import { arcsPattern } from "./arcs";
import { framePattern } from "./frame";
import { arcticPattern } from "./arctic";
import { mirrorPattern } from "./mirror";
import { testPattern } from "./test";

export type PatternArgs = {
  p: P5CanvasInstance;
  matrix: OccupancyGrid;
  resX: number;
  resY: number;
  len: number;
  randomProvider: () => number;
  weights: {
    left: number;
    right: number;
    up: number;
    down: number;
  };
};

export const patterns = [
  {
    name: "random",
    pattern: randomPattern,
  },
  {
    name: "snail",
    pattern: snailPattern,
  },
  {
    name: "spotlight",
    pattern: spotlightPattern,
  },
  {
    name: "arcs",
    pattern: arcsPattern,
  },
  {
    name: "frame",
    pattern: framePattern,
  },
  {
    name: "arctic",
    pattern: arcticPattern,
  },
  {
    name: "mirror",
    pattern: mirrorPattern,
  },
  {
    name: "test",
    pattern: testPattern,
  },
] as const;

export const patternNames = patterns.map((x) => x.name);
