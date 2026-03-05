import { Worm } from "../Worm";
import type { PatternArgs } from ".";
import { WormNavigator } from "../WormNavigator";

export function random2Pattern({
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

    while (
      worm.body.length < len &&
      navigator.tryGoUsingWeights(worm, dirWeights)
    );
  }

  return worms;
}
