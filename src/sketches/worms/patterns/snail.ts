import { Worm } from "../Worm";
import type { PatternArgs } from ".";

export function snailPattern({
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
  //   });

  //   worm.goRandom(randomProvider);

  //   let i = 1;
  //   while (!worm.finished) {
  //     if (i !== 0 && i % len === 0) {
  //       if (!worm.go("left")) {
  //         worm.finished = true;
  //       }
  //     } else if (!worm.go("up")) {
  //       if (!worm.go("left")) {
  //         worm.finished = true;
  //       } else {
  //         i = 0;
  //       }
  //     }
  //     i++;
  //   }

  //   worms.push(worm);
  // } while (randomOrigin);

  return worms;
}
