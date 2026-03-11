import { Worm } from "../Worm";
import type { PatternArgs } from ".";
import { WormNavigator } from "../WormNavigator";
import type { DirMap } from "@/sketches/utils";
import { OccupancyGrid } from "@/utils/OccupancyGrid";
import { Size } from "@/sketches/tiles/Size";

export const directionalPattern =
  ({ directionX, directionY }: { directionX: number; directionY: number }) =>
  ({ resX, resY, len, randomProvider }: PatternArgs): Worm[] => {
    const occupancyGrid = new OccupancyGrid(
      new Size(resX, resY),
      randomProvider,
    );
    const worms = [];
    const navigator = new WormNavigator(occupancyGrid, randomProvider);
    let worm;
    const dirWeights: DirMap<number> = {
      left: directionX,
      right: 1 - directionX,
      down: directionY,
      up: 1 - directionY,
    };

    while (true) {
      worm = navigator.spawnWormRandomly();

      if (worm) {
        worms.push(worm);
      } else {
        break;
      }

      while (
        worm.body.length < len &&
        navigator.goUsingWeights(worm, dirWeights)
      );
    }

    return worms;
  };
