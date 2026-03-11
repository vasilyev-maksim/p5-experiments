import { Worm } from "../Worm";
import type { PatternArgs } from ".";
import { OccupancyGrid } from "@/utils/OccupancyGrid";
import { Size } from "@/sketches/tiles/Size";
import { WormNavigator } from "../WormNavigator";
import p5 from "p5";

export function mirrorPattern({
  resY,
  resX,
  len,
  randomProvider,
}: PatternArgs): Worm[] {
  const size = new Size(resX, resY);
  const quadrantSize = new Size(Math.ceil(resX / 2), Math.ceil(resY / 2));
  const occupancyGrid = new OccupancyGrid(quadrantSize, randomProvider);
  const quadrantHalf: Worm[] = [];
  const navigator = new WormNavigator(occupancyGrid, randomProvider);

  occupyDiagTriangle(occupancyGrid, quadrantSize);

  let worm;
  while (true) {
    worm = navigator.spawnWormRandomly();

    if (worm) {
      quadrantHalf.push(worm);
    } else {
      break;
    }

    while (worm.body.length < len && navigator.goRandom(worm));
  }

  const quadrant = mirrorQuadrantHalf(quadrantHalf, quadrantSize);
  return mirrorQuadrant(quadrant, size);
}

export function occupyDiagTriangle(
  occupancyGrid: OccupancyGrid,
  { height, width }: Size,
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

export function mirrorQuadrant(quadrant: Worm[], size: Size) {
  return quadrant.flatMap((worm) => {
    const { head, tail } = worm;

    const mirror = [
      new Worm({
        head: new p5.Vector(size.width - head.x - 1, head.y),
        headDir: "up",
        tail: tail.map(
          (tail) => new p5.Vector(size.width - tail.x - 1, tail.y),
        ),
      }),
      new Worm({
        head: new p5.Vector(size.width - head.x - 1, size.height - head.y - 1),
        headDir: "up",
        tail: tail.map(
          (tail) =>
            new p5.Vector(size.width - tail.x - 1, size.height - tail.y - 1),
        ),
      }),
      new Worm({
        head: new p5.Vector(head.x, size.height - head.y - 1),
        headDir: "up",
        tail: tail.map(
          (tail) => new p5.Vector(tail.x, size.height - tail.y - 1),
        ),
      }),
    ];

    return [worm, ...mirror];
  });
}

export function mirrorQuadrantHalf(quadrant: Worm[], size: Size) {
  return quadrant.flatMap((worm) => {
    const { head, tail } = worm;

    return [
      worm,
      new Worm({
        head: new p5.Vector(size.width - head.x - 1, size.height - head.y - 1),
        headDir: "up",
        tail: tail.map(
          (tail) =>
            new p5.Vector(size.width - tail.x - 1, size.height - tail.y - 1),
        ),
      }),
    ];
  });
}
