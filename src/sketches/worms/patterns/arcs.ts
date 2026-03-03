import { Worm } from "../Worm";
import type { PatternArgs } from ".";

export function arcsPattern({ matrix, resY, p }: PatternArgs): Worm[] {
  const worms: Worm[] = [];
  for (let i = 0; i < resY / 2; i++) {
    const worm = new Worm({
      headDir: "right",
      head: p.createVector(0, i % 2 === 1 ? i : resY - i - 1),
      availablePositionsDict: matrix,
    });
    while (worm.grow("up"));
    worm.grow(i % 2 === 1 ? "right" : "left");
    while (worm.grow("up"));
    worm.grow(i % 2 === 1 ? "right" : "left");
    while (worm.grow("up"));

    worms.push(worm);
  }

  return worms;
}
