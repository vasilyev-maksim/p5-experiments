import type { BoolMatrix } from "@/utils/BoolMatrix";
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
  matrix: BoolMatrix;
  resX: number;
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
// ["random", "spiral", "angle", "3"]
export const patternNames = patterns.map((x) => x.name);
