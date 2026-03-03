import type { PatternArgs } from ".";
import { Worm2 } from "../Worm2";

export function testPattern({ matrix, resY, p }: PatternArgs): Worm2[] {
  const worm = new Worm2({
    head: p.createVector(0, 0),
    headDir: "right",
  });

  for (let i = 0; i < 3; i++) {
    worm.go();
  }

  return [worm];
}
