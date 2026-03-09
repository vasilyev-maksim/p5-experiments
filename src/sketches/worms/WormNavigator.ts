import type { RandomProvider } from "@/core/models";
import {
  DIRS_CLOCKWISE,
  type Dir,
  rotate,
  getAbsVecFromDir,
  type DirMap,
} from "@/sketches/utils";
import type { OccupancyGrid } from "@/utils/OccupancyGrid";
import p5 from "p5";
import { Worm } from "./Worm";

export class WormNavigator {
  public constructor(
    private readonly occupancyGrid: OccupancyGrid,
    private readonly randomProvider: RandomProvider,
  ) {}

  public spawnWormRandomly(initialDir: Dir = "up"): Worm | null {
    const randomHead = this.occupancyGrid.getRandomFreeCell();
    if (randomHead) {
      return this.spawnWormAtCell(randomHead, initialDir);
    } else {
      return null;
    }
  }

  public spawnWormAtCell(cell: p5.Vector, initialDir: Dir = "up"): Worm | null {
    const worm = new Worm({
      head: cell,
      headDir: initialDir,
    });
    this.occupancyGrid.occupy(cell);
    return worm;
  }

  public goToAttractor(worm: Worm, attractor: p5.Vector) {
    const cellsAround = this.lookAroundClockwise(worm);
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

    return dirs.some(({ dir }) => this.goToDir(worm!, dir));
  }

  public lookAroundClockwise(worm: Worm) {
    return DIRS_CLOCKWISE.map((dir) => this.inspectCell(worm, dir));
  }

  public inspectCell(worm: Worm, dir: Dir) {
    const relDir = rotate(dir, worm.headDir);
    const absDir = getAbsVecFromDir(relDir);
    const cell = p5.Vector.add(worm.head, absDir);
    const free = this.occupancyGrid.isOccupied(cell) === false;

    return {
      free,
      dir,
      relDir, // TODO: rethink prop names
      absDir,
      cell,
      goTo: () => {
        if (free) {
          worm.turn(dir);
          worm.go();
          this.occupancyGrid.occupy(worm.head);
          return true;
        } else {
          return false;
        }
      },
    };
  }

  public goToDir(worm: Worm, dir: Dir): boolean {
    const cell = this.inspectCell(worm, dir);
    return cell.goTo();
  }

  public goUsingWeights(worm: Worm, dirWeights: DirMap<number>): boolean {
    const freeCells = this.lookAroundClockwise(worm).filter((x) => x.free);
    const targetCell = freeCells
      .map((x) => ({
        ...x,
        weight: dirWeights[x.relDir],
      }))
      .filter((x) => x.weight > 0)
      .sort((a, b) => b.weight - a.weight)[0];

    return targetCell?.goTo() ?? false;
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
