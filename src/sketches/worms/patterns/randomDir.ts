import { Worm } from "../Worm";
import type { PatternArgs } from ".";
import { WormNavigator } from "../WormNavigator";
import { OccupancyGrid } from "@/utils/OccupancyGrid";
import { Size } from "@/sketches/tiles/Size";

export function randomDirectionalPattern({
  len,
  resX,
  resY,
  randomProvider,
}: PatternArgs): Worm[] {
  const occupancyGrid = new OccupancyGrid(new Size(resX, resY), randomProvider);
  const worms = [];
  const navigator = new WormNavigator(occupancyGrid, randomProvider);
  let worm;

  while (true) {
    worm = navigator.spawnWormRandomly();

    if (worm) {
      worms.push(worm);
    } else {
      break;
    }

    while (worm.body.length < len && navigator.goRandom(worm));
  }

  return worms;
}
