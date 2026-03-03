import { Worm2 } from "../Worm2";
import type { PatternArgs } from ".";

export function mirrorPattern({ resY, p, resX }: PatternArgs): Worm2[] {
  const mid = p.createVector(Math.ceil(resX / 2), Math.ceil(resY / 2));
  const mid2 = p.createVector(Math.ceil(resX / 4), Math.ceil(resY / 4));
  const mid4 = p.createVector(Math.ceil(resX / 8), Math.ceil(resY / 8));
  const quadrant: Worm2[] = [];

  let worm: Worm2;

  worm = new Worm2({
    headDir: "right",
    head: p.createVector(mid2.x, mid.y),
  });
  worm.go(p.createVector(mid2.x, mid2.y));
  worm.go(p.createVector(mid.x, mid2.y));

  quadrant.push(worm);

  function r(n: number) {
    const sn2 = p.createVector(
      Math.ceil(resX / (n * 2)),
      Math.ceil(resY / (n * 2)),
    );
    const sn = p.createVector(Math.ceil(resX / n), Math.ceil(resY / n));
    worm = new Worm2({
      headDir: "right",
      head: p.createVector(sn2.x, sn2.y),
    });
    worm.go(p.createVector(sn2.x + sn.x, sn2.y));
    worm.go(p.createVector(sn2.x + sn.x, sn.y + sn2.y));
    worm.go(p.createVector(sn2.x, sn.y + sn2.y));
    worm.go(p.createVector(sn2.x, sn2.y));

    quadrant.push(worm);
  }

  r(4);
  r(8);
  r(16);
  r(32);

  // worm = new Worm2({
  //   headDir: "right",
  //   head: p.createVector(1, mid.y),
  // });
  // worm.go(p.createVector(mid.x - 1, 1));

  // quadrant.push(worm);

  return quadrant.flatMap((worm) => {
    const { head, tail } = worm;

    const mirror = [
      new Worm2({
        head: p.createVector(resX - head.x, head.y),
        headDir: "up",
        tail: tail.map((tail) => p.createVector(resX - tail.x, tail.y)),
      }),
      new Worm2({
        head: p.createVector(resX - head.x, resY - head.y),
        headDir: "up",
        tail: tail.map((tail) => p.createVector(resX - tail.x, resY - tail.y)),
      }),
      new Worm2({
        head: p.createVector(head.x, resY - head.y),
        headDir: "up",
        tail: tail.map((tail) => p.createVector(tail.x, resY - tail.y)),
      }),
    ];

    return [worm, ...mirror];
  });
}
