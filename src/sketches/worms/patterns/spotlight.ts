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

    while (worm.go("up"));
    worm.go("right");
    while (worm.go("up"));

    worms.push(worm);
  }
  return worms;
}
