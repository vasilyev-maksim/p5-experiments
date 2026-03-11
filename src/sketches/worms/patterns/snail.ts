import { Worm } from "../Worm";
import type { PatternArgs } from ".";
import { WormNavigator } from "../WormNavigator";
import { OccupancyGrid } from "@/utils/OccupancyGrid";
import { Size } from "@/sketches/tiles/Size";

export function snailPattern({
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

    if (!navigator.goRandom(worm)) {
      continue;
    }

    let i = 1;
    while (true) {
      if (i % len === 0) {
        if (!navigator.goToDir(worm, "left")) {
          break;
        }
      } else if (!navigator.goToDir(worm, "up")) {
        if (!navigator.goToDir(worm, "left")) {
          break;
        } else {
          i = 0;
        }
      }
      i++;
    }
  }

  return worms;
}
