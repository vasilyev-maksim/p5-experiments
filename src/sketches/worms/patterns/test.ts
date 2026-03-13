import { Worm } from "../Worm";
import type { PatternArgs } from ".";
import p5 from "p5";

export function testPattern({ resX }: PatternArgs): Worm[] {
  const worms = [];

  const worm: Worm = new Worm({
    head: new p5.Vector(0, 0),
    headDir: "left",
  });

  let i = 0;
  while (i++ < resX - 1) {
    worm.go();
  }

  worms.push(worm);
  worms.push(
    new Worm({
      head: new p5.Vector(resX - 1, 1),
      headDir: "left",
      tail: [new p5.Vector(0, 1)],
    }),
  );
  // console.log(worm);

  return worms;
}
