import type { RandomProvider } from "@/core/models";
import {
  DIRS_CLOCKWISE,
  type Dir,
  getAbsVecFromDir,
  type DirMap,
  rotate,
} from "./utils";
import type { OccupancyGrid } from "@utils/OccupancyGrid";
import { Worm } from "./Worm";
import type { Vector } from "@/utils/Vector";

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

  public spawnWormAtCell(cell: Vector): Worm | null {
    const worm = new Worm({
      head: cell,
    });
    this.occupancyGrid.occupy(cell);
    return worm;
  }

  public goToAttractor(worm: Worm, attractor: Vector) {
    const filteredCells = this.inspectFreeAdjacentCells(worm.head)
      .map((x) => {
        const nextDistToAttractor = attractor.sub(x.cell).mag();
        const currDistToAttractor = attractor.sub(worm!.head).mag();

        return {
          ...x,
          weight: currDistToAttractor - nextDistToAttractor,
        };
      })
      .filter((x) => x.weight > 0)
      .sort((a, b) => b.weight - a.weight);

    return filteredCells.some(({ cell }) => this.gotoCell(worm, cell));
  }

  public goToDir(worm: Worm, relDir: Dir): boolean {
    const absDir = rotate(relDir, worm.headDir ?? "up");
    const cell = getAbsVecFromDir(absDir).add(worm.head);
    return this.gotoCell(worm, cell);
  }

  public goUsingWeights(worm: Worm, dirWeights: DirMap<number>): boolean {
    const targetCell = this.inspectFreeAdjacentCells(worm.head)
      .map((x) => ({
        ...x,
        weight: dirWeights[x.dir],
      }))
      .filter((x) => x.weight > 0)
      .sort((a, b) => {
        return b.weight - a.weight;
      })[0]?.cell;

    return targetCell ? this.gotoCell(worm, targetCell) : false;
  }

  public goRandom(worm: Worm): boolean {
    return this.goUsingWeights(worm, {
      up: this.randomProvider(),
      down: this.randomProvider(),
      left: this.randomProvider(),
      right: this.randomProvider(),
    });
  }

  private inspectFreeAdjacentCells(cell: Vector) {
    return DIRS_CLOCKWISE.map((dir) => {
      const adjacentCell = cell.add(getAbsVecFromDir(dir));

      if (this.isCellFree(adjacentCell)) {
        return { cell: adjacentCell, dir };
      } else {
        return null;
      }
    }).filter(Boolean) as {
      cell: Vector;
      dir: Dir;
    }[];
  }

  private gotoCell(worm: Worm, cell: Vector): boolean {
    if (this.isCellFree(cell)) {
      worm.goTo(cell);
      this.occupancyGrid.occupy(worm.head);
      return true;
    } else {
      return false;
    }
  }

  private isCellFree(cell: Vector): boolean {
    return this.occupancyGrid.isOccupied(cell) === false;
  }
}
