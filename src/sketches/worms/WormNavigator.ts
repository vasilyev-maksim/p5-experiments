import type { RandomProvider } from "@/core/models";
import {
  REL_DIRS_CLOCKWISE,
  type RelDir,
  rotate,
  getAbsVecFromRelDir,
  type RelDirMap,
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
      const worm = new Worm({
        head: randomHead,
        headDir: "up",
      });
      this.occupancyGrid.occupy(randomHead);
      return worm;
    } else {
      return null;
    }
  }

  public lookAroundClockwise(worm: Worm) {
    return REL_DIRS_CLOCKWISE.map((dir) => this.inspectCell(worm, dir));
  }

  public inspectCell(worm: Worm, dir: RelDir) {
    const relDir = rotate(dir, worm.headDir);
    const absDir = getAbsVecFromRelDir(relDir);
    const cell = p5.Vector.add(worm.head, absDir);
    const free = this.occupancyGrid.isOccupied(cell) === false;

    return {
      free,
      relDir,
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

  public tryGoToDir(worm: Worm, dir: RelDir): boolean {
    const cell = this.inspectCell(worm, dir);
    return cell.goTo();
  }

  public tryGoUsingWeights(
    worm: Worm,
    dirWeights: RelDirMap<number>
  ): boolean {
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

  public tryGoRandom(worm: Worm): boolean {
    return this.tryGoUsingWeights(worm, {
      up: this.randomProvider(),
      down: this.randomProvider(),
      left: this.randomProvider(),
      right: this.randomProvider(),
    });
  }
}
