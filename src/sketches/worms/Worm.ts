import p5 from "p5";
import {
  getAbsVecFromRelDir,
  getRandomRelDirOrder,
  type RelDir,
  rotate,
} from "../utils";
import type { BoolMatrix } from "@/utils/BoolMatrix";

export type WormParams = {
  head: p5.Vector;
  length?: number;
  availablePositionsDict: BoolMatrix;
  headDir: RelDir;
};

export class Worm {
  public readonly tail: p5.Vector[] = [];
  public head;
  public headDir;
  public readonly length?;
  public readonly availablePositionsDict;
  public finished = false;

  public constructor({
    head,
    length,
    headDir,
    availablePositionsDict,
  }: WormParams) {
    this.head = new p5.Vector(head.x, head.y);
    this.length = length;
    this.headDir = headDir;
    this.availablePositionsDict = availablePositionsDict;

    this.availablePositionsDict.set(this.head, false);
  }

  public get body() {
    return [this.head, ...this.tail];
  }

  private inspectDir(dir: RelDir) {
    const nextHeadDir = rotate(dir, this.headDir);
    const dirVec = getAbsVecFromRelDir(nextHeadDir);
    const nextHead = p5.Vector.add(this.head, dirVec);
    return {
      available: this.availablePositionsDict.get(nextHead),
      nextHeadDir,
      nextHead,
      dir,
    };
  }

  public grow(dir: RelDir) {
    if (this.length !== undefined && this.tail.length >= this.length) {
      return false;
    }

    const { available, nextHeadDir, nextHead } = this.inspectDir(dir);

    if (available) {
      this.tail.unshift(this.head);
      this.head = nextHead;
      this.headDir = nextHeadDir;
      this.availablePositionsDict.set(nextHead, false);

      if (this.length !== undefined && this.tail.length === this.length) {
        this.finished = true;
      }

      return true;
    }

    return false;
  }

  public growOrFinish(dir: RelDir) {
    if (!this.grow(dir)) {
      this.finished = true;
    }
  }

  public growX(dir: RelDir, times: number) {
    for (let i = 0; i < times && this.grow(dir); i++);
  }

  public growRandom(randomProvider: () => number = Math.random) {
    const randomDir = getRandomRelDirOrder(randomProvider)
      .map((x) => this.inspectDir(x))
      .filter((x) => x.available)[0];

    if (randomDir) {
      this.grow(randomDir.dir);
    } else {
      this.finished = true;
    }
  }
}
