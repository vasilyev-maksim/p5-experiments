import type { BoolMatrix } from "@/utils/BoolMatrix";
import { Worm } from "../Worm";
import type p5 from "p5";

export function spotlightPattern({
  matrix,
  resY,
  p,
}: {
  matrix: BoolMatrix;
  resY: number;
  p: p5;
}): Worm[] {
  const worms: Worm[] = [];
  for (let i = 1; i <= resY; i++) {
    const worm = new Worm({
      headDir: "right",
      head: p.createVector(1, i),
      availablePositionsDict: matrix,
    });

    while (worm.grow("up"));
    worm.grow("right");
    while (worm.grow("up"));

    worms.push(worm);
  }
  return worms;
}
