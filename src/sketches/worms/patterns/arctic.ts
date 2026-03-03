import type { PatternArgs } from ".";
import { Worm2 } from "../Worm2";

export function arcticPattern({ resY, p, resX }: PatternArgs): Worm2[] {
  const worms: Worm2[] = [];
  const worm = new Worm2({
    headDir: "down",
    head: p.createVector(1, Math.ceil(resY / 2)),
  });

  // console.log(1111, worm.head);

  const R = Math.round(resY / 4);

  let dir: "left" | "right" = "left";

  for (let i = 0; i <= R * 2 + 1; i++) {
    worm.turn(dir);
    worm.go();
    worm.turn(dir);

    dir = dir === "left" ? "right" : "left";

    const h = i > R ? R * 2 + 1 - i : i;
    for (let j = 0; j < h; j++) {
      worm.go();
    }
  }

  // worm.turn("left").go();

  for (let i = 0; i <= R * 2 + 1; i++) {
    worm.turn(dir);
    worm.go();
    worm.turn(dir);

    dir = dir === "left" ? "right" : "left";

    const h = i > R ? R * 2 + 1 - i : i;
    for (let j = 0; j < h; j++) {
      worm.go();
    }
  }

  console.log(worm);

  worms.push(worm);
  return worms;
}
