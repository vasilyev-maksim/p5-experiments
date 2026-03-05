import {
  getAbsVecFromRelDir,
  REL_DIRS_CLOCKWISE,
  rotate,
  type RelDir,
} from "@/sketches/utils";
import type { PatternArgs } from ".";
import { Worm } from "../Worm";
import p5 from "p5";
import { OccupancyGrid } from "@/utils/OccupancyGrid";
import { shuffle } from "@/utils/misc";

export function testPattern({
  matrix,
  weights,
  len,
  randomProvider,
}: PatternArgs): Worm[] {
  const worms = [];
  let worm;

  while (true) {
    worm = spawnWormRandomly(matrix);

    if (worm) {
      worms.push(worm);
    } else {
      break;
    }

    if (!tryGoRandom(worm, matrix, randomProvider)) {
      continue;
    }

    let i = 1;
    while (true) {
      // const freeCells = lookAroundClockwise(worm, matrix).filter(
      //   (x) => x.free,
      // );

      // RANDOM
      // const cell = shuffle(
      //   freeCells,
      //   randomProvider,
      // )[0];

      // RANDOM with weights
      // const cell = freeCells
      //   .map((x) => ({
      //     ...x,
      //     weight: weights[x.relDir],
      //   }))
      //   .filter((x) => x.weight > 0)
      //   .sort((a, b) => b.weight - a.weight)[0];

      // if (cell) {
      //   cell.goTo();
      // } else {
      //   break;
      // }

      //   while (!worm.finished) {
      if (i % len === 0) {
        if (!tryGoTo(worm, matrix, "left")) {
          break;
        }
      } else if (!tryGoTo(worm, matrix, "up")) {
        if (!tryGoTo(worm, matrix, "left")) {
          break;
        } else {
          i = 0;
        }
      }
      i++;
      //   }

      // if (!tryGoTo(worm, matrix, "up") && !tryGoTo(worm, matrix, "right")) {
      //   break;
      // }
    }
  }

  // console.log(matrix);
  return worms;
  // return worms.slice(0, 1);
}

function spawnWormRandomly(occupancyGrid: OccupancyGrid): Worm | null {
  const randomHead = occupancyGrid.getRandomFreeCell();
  if (randomHead) {
    const worm = new Worm({
      head: randomHead,
      headDir: "up",
    });
    occupancyGrid.occupy(randomHead);
    return worm;
  } else {
    return null;
  }
}

function lookAroundClockwise(worm: Worm, occupancyGrid: OccupancyGrid) {
  return REL_DIRS_CLOCKWISE.map((dir) => inspectDir(worm, occupancyGrid, dir));
}

function inspectDir(worm: Worm, occupancyGrid: OccupancyGrid, dir: RelDir) {
  const relDir = rotate(dir, worm.headDir);
  const absDir = getAbsVecFromRelDir(relDir);
  const cell = p5.Vector.add(worm.head, absDir);
  const free = occupancyGrid.isOccupied(cell) === false;

  // TODO: normal var names
  return {
    free,
    absDir,
    relDir,
    cell,
    dir,
    worm,
    goTo: () => {
      if (free) {
        worm.turn(dir);
        worm.go();
        occupancyGrid.occupy(worm.head);
        return true;
      } else {
        return false;
      }
    },
  };
}

function tryGoTo(
  worm: Worm,
  occupancyGrid: OccupancyGrid,
  dir: RelDir,
): boolean {
  const cell = inspectDir(worm, occupancyGrid, dir);
  return cell.goTo();
}

function tryGoRandom(
  worm: Worm,
  occupancyGrid: OccupancyGrid,
  randomProvider: () => number,
): boolean {
  const freeCells = lookAroundClockwise(worm, occupancyGrid).filter(
    (x) => x.free,
  );
  const randomCell = shuffle(freeCells, randomProvider)[0];
  return randomCell?.goTo() ?? false;
}
