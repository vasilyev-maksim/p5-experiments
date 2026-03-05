import { Worm } from "../Worm";
import type { PatternArgs } from ".";

export function mirrorPattern({ resY, p, resX }: PatternArgs): Worm[] {
  // const mid = p.createVector(Math.ceil(resX / 2), Math.ceil(resY / 2));
  // const mid2 = p.createVector(Math.ceil(resX / 4), Math.ceil(resY / 4));
  // const mid4 = p.createVector(Math.ceil(resX / 8), Math.ceil(resY / 8));

  const quadrant: Worm[] = [];

  return quadrant.flatMap((worm) => {
    const { head, tail } = worm;

    const mirror = [
      new Worm({
        head: p.createVector(resX - head.x, head.y),
        headDir: "up",
        tail: tail.map((tail) => p.createVector(resX - tail.x, tail.y)),
      }),
      new Worm({
        head: p.createVector(resX - head.x, resY - head.y),
        headDir: "up",
        tail: tail.map((tail) => p.createVector(resX - tail.x, resY - tail.y)),
      }),
      new Worm({
        head: p.createVector(head.x, resY - head.y),
        headDir: "up",
        tail: tail.map((tail) => p.createVector(tail.x, resY - tail.y)),
      }),
    ];

    return [worm, ...mirror];
  });
}
