import { Worm } from "../Worm";
import type { PatternArgs } from ".";
import { WormNavigator } from "../WormNavigator";
import { OccupancyGrid } from "@utils/OccupancyGrid";

export function randomDirectionalPattern({
  len,
  resX,
  resY,
  randomProvider,
}: PatternArgs): Worm[] {
  const occupancyGrid = new OccupancyGrid(resX, resY, randomProvider);
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

    while (worm.length < len && navigator.goRandom(worm));
  }

  return worms;
}
