import { Worm } from "../Worm";
import type { PatternArgs } from ".";
import { OccupancyGrid } from "@/utils/OccupancyGrid";
import { WormNavigator } from "../WormNavigator";
import p5 from "p5";

export function mirrorPattern({
  resY,
  resX,
  len,
  randomProvider,
}: PatternArgs): Worm[] {
  const quadrantWidth = Math.ceil(resX / 2);
  const quadrantHeight = Math.ceil(resY / 2);
  const occupancyGrid = new OccupancyGrid(
    quadrantWidth,
    quadrantHeight,
    randomProvider,
  );
  const quadrantHalf: Worm[] = [];
  const navigator = new WormNavigator(occupancyGrid, randomProvider);

  occupyDiagTriangle(occupancyGrid, quadrantWidth, quadrantHeight);

  let worm;
  while (true) {
    worm = navigator.spawnWormRandomly();

    if (worm) {
      quadrantHalf.push(worm);
    } else {
      break;
    }

    while (worm.length < len && navigator.goRandom(worm));
  }

  const quadrant = mirrorQuadrantHalf(
    quadrantHalf,
    quadrantWidth,
    quadrantHeight,
  );
  return mirrorQuadrant(quadrant, resX, resY);
}

export function occupyDiagTriangle(
  occupancyGrid: OccupancyGrid,
  width: number,
  height: number,
) {
  const k = width / height;
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (x > k * y) {
        occupancyGrid.occupy(new p5.Vector(x, y));
      }
    }
  }
}

export function mirrorQuadrant(
  quadrant: Worm[],
  width: number,
  height: number,
) {
  return quadrant.flatMap((worm) => {
    const { head, tail } = worm;

    const mirror = [
      new Worm({
        head: new p5.Vector(width - head.x - 1, head.y),
        length: worm.length,
        tail: tail.map((tail) => new p5.Vector(width - tail.x - 1, tail.y)),
      }),
      new Worm({
        head: new p5.Vector(width - head.x - 1, height - head.y - 1),
        length: worm.length,
        tail: tail.map(
          (tail) => new p5.Vector(width - tail.x - 1, height - tail.y - 1),
        ),
      }),
      new Worm({
        head: new p5.Vector(head.x, height - head.y - 1),
        length: worm.length,
        tail: tail.map((tail) => new p5.Vector(tail.x, height - tail.y - 1)),
      }),
    ];

    return [worm, ...mirror];
  });
}

export function mirrorQuadrantHalf(
  quadrant: Worm[],
  width: number,
  height: number,
) {
  return quadrant.flatMap((worm) => {
    const { head, tail } = worm;

    return [
      worm,
      new Worm({
        head: new p5.Vector(width - head.x - 1, height - head.y - 1),
        length: worm.length,
        tail: tail.map(
          (tail) => new p5.Vector(width - tail.x - 1, height - tail.y - 1),
        ),
      }),
    ];
  });
}
