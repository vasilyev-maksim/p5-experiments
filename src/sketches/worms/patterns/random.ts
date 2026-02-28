import type { BoolMatrix } from "@/utils/BoolMatrix";
import { Worm } from "../Worm";

export function randomPattern({
  matrix,
  len,
  randomProvider,
}: {
  matrix: BoolMatrix;
  len: number;
  randomProvider: () => number;
}): Worm[] {
  const worms: Worm[] = [];
  let randomOrigin;
  do {
    randomOrigin = matrix.getRandomTrue();

    if (!randomOrigin) {
      break;
    }

    const worm = new Worm({
      headDir: "up",
      head: randomOrigin,
      availablePositionsDict: matrix,
      length: len,
    });

    while (!worm.finished) {
      worm.growRandom(randomProvider);
    }

    worms.push(worm);
  } while (randomOrigin);

  return worms;
}
