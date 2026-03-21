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
    const filteredCells = this.inspectFreeAdjacentCells(worm.head)
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

  private inspectFreeAdjacentCells(cell: p5.Vector) {
    return DIRS_CLOCKWISE.map((dir) => {
      const adjacentCell = p5.Vector.add(cell, getAbsVecFromDir(dir));

      if (this.isCellFree(adjacentCell)) {
        return { cell: adjacentCell, dir };
      } else {
        return null;
      }
    }).filter(Boolean) as {
      cell: p5.Vector;
      dir: Dir;
    }[];
  }

  private gotoCell(worm: Worm, cell: p5.Vector): boolean {
    if (this.isCellFree(cell)) {
      worm.goTo(cell);
      this.occupancyGrid.occupy(worm.head);
      return true;
    } else {
      return false;
    }
  }

  private isCellFree(cell: p5.Vector): boolean {
    return this.occupancyGrid.isOccupied(cell) === false;
  }
}
