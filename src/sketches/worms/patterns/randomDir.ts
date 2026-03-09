import { Worm } from "../Worm";
import type { PatternArgs } from ".";
import { WormNavigator } from "../WormNavigator";

export function randomDirectionalPattern({
  occupancyGrid,
  len,
  randomProvider,
}: PatternArgs): Worm[] {
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
