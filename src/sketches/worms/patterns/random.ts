import { Worm } from "../Worm";
import type { PatternArgs } from ".";
import { WormNavigator } from "../WormNavigator";
import type { RelDirMap } from "@/sketches/utils";

export function randomPattern({
  matrix,
  len,
  randomProvider,
  dirWeights,
}: PatternArgs): Worm[] {
  const worms = [];
  const navigator = new WormNavigator(matrix, randomProvider);
  let worm;

  while (true) {
    worm = navigator.spawnWormRandomly();

    if (worm) {
      worms.push(worm);
    } else {
      break;
    }

    while (worm.body.length < len) {
      const randomWeights = Object.fromEntries(
        Object.entries(dirWeights).map(([key, value]) => {
          return [key, value * randomProvider()];
        }),
      ) as RelDirMap<number>;

      if (!navigator.tryGoUsingWeights(worm, randomWeights)) {
        break;
      }
    }
  }

  return worms;
}
