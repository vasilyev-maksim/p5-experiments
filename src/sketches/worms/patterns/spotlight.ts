import { Worm } from "../Worm";
import type { PatternArgs } from ".";

export function spotlightPattern({ matrix, resY, p }: PatternArgs): Worm[] {
  const worms: Worm[] = [];
  for (let i = 0; i < resY; i++) {
    const worm = new Worm({
      headDir: "right",
      head: p.createVector(0, i),
      availablePositionsDict: matrix,
    });

    while (worm.grow("up"));
    worm.grow("right");
    while (worm.grow("up"));

    worms.push(worm);
  }
  return worms;
}
