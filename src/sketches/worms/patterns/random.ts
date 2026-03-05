import { Worm } from "../Worm";
import type { PatternArgs } from ".";

export function randomPattern({
  matrix,
  len,
  randomProvider,
}: PatternArgs): Worm[] {
  const worms: Worm[] = [];
  let randomOrigin;
  // do {
  //   randomOrigin = matrix.getRandomTrue();

  //   if (!randomOrigin) {
  //     break;
  //   }

  //   const worm = new Worm({
  //     headDir: "up",
  //     head: randomOrigin,
  //     availablePositionsDict: matrix,
  //     length: len,
  //   });

  //   while (!worm.finished) {
  //     worm.goRandom(randomProvider);
  //   }

  //   worms.push(worm);
  // } while (randomOrigin);

  return worms;
}
