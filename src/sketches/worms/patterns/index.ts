import type { BoolMatrix } from "@/utils/BoolMatrix";
import type { P5CanvasInstance } from "@p5-wrapper/react";
import { randomPattern } from "./random";
import { snailPattern } from "./snail";
import { spotlightPattern } from "./spotlight";
import { arcsPattern } from "./arcs";

export type PatternArgs = {
  p: P5CanvasInstance;
  matrix: BoolMatrix;
  resY: number;
  len: number;
  randomProvider: () => number;
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
] as const;
// ["random", "spiral", "angle", "3"]
export const patternNames = patterns.map((x) => x.name);
