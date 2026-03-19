import type { RandomProvider } from "@/core/models";
import {
  DIRS_CLOCKWISE,
  type Dir,
  getAbsVecFromDir,
  type DirMap,
  rotate,
} from "@/sketches/utils";
import type { OccupancyGrid } from "@/utils/OccupancyGrid";
import p5 from "p5";
import { Worm } from "./Worm";

export class WormNavigator {
  public constructor(
    private readonly occupancyGrid: OccupancyGrid,
    private readonly randomProvider: RandomProvider,
  ) {}

  public spawnWormRandomly(): Worm | null {
    const randomHead = this.occupancyGrid.getRandomFreeCell();
    if (randomHead) {
      return this.spawnWormAtCell(randomHead);
    } else {
      return null;
    }
  }

  public spawnWormAtCell(cell: p5.Vector): Worm | null {
    const worm = new Worm({
      head: cell,
    });
    this.occupancyGrid.occupy(cell);
    return worm;
  }

  public goToAttractor(worm: Worm, attractor: p5.Vector) {
    const cellsAround = this.lookAroundClockwise(worm.head);
    const dirs = cellsAround
      .filter((x) => x.free)
      .map((x) => {
        const nextDistToAttractor = p5.Vector.sub(attractor, x.cell).mag();
        const currDistToAttractor = p5.Vector.sub(attractor, worm!.head).mag();

        return {
          ...x,
          weight: currDistToAttractor - nextDistToAttractor,
        };
      })
      .filter((x) => x.weight > 0)
      .sort((a, b) => b.weight - a.weight);

    return dirs.some(({ goTo }) => goTo(worm));
  }

  public static getAdjacentCell(cell: p5.Vector, dir: Dir) {
    return getAbsVecFromDir(dir).add(cell);
  }

  public lookAroundClockwise(cell: p5.Vector) {
    return DIRS_CLOCKWISE.map((dir) => {
      const adjacentCell = WormNavigator.getAdjacentCell(cell, dir);
      return { ...this.inspectCell(adjacentCell), dir };
    });
  }

  // TODO: rethink
  public inspectCell(cell: p5.Vector) {
    const free = this.occupancyGrid.isOccupied(cell) === false;

    return {
      free,
      // absDir,
      // dir,
      cell,
      goTo: (worm: Worm) => {
        if (free) {
          // worm.turn(relDir);
          worm.goTo(cell);
          this.occupancyGrid.occupy(worm.head);
          return true;
        } else {
          return false;
        }
      },
    };
  }

  public goToDir(worm: Worm, relDir: Dir): boolean {
    const absDir = rotate(relDir, worm.headDir ?? "up");
    const cell = WormNavigator.getAdjacentCell(worm.head, absDir);
    return this.inspectCell(cell).goTo(worm);
  }

  public goUsingWeights(worm: Worm, dirWeights: DirMap<number>): boolean {
    const freeCells = this.lookAroundClockwise(worm.head).filter((x) => x.free);
    const targetCell = freeCells
      .map((x) => ({
        ...x,
        weight: dirWeights[x.dir],
      }))
      .filter((x) => x.weight > 0)
      .sort((a, b) => b.weight - a.weight)[0];

    return targetCell?.goTo(worm) ?? false;
  }

  public goRandom(worm: Worm): boolean {
    return this.goUsingWeights(worm, {
      up: this.randomProvider(),
      down: this.randomProvider(),
      left: this.randomProvider(),
      right: this.randomProvider(),
    });
  }
}
