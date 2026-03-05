import p5 from "p5";
import {
  getAbsVecFromRelDir,
  rotate,
  // getRandomRelDirOrder,
  type RelDir,
  // rotate,
} from "../utils";

export type WormParams = {
  head: p5.Vector;
  // length?: number;
  headDir: RelDir;
};

export class Worm {
  public readonly tail: p5.Vector[] = [];
  public head;
  public headDir;
  // public readonly length?;

  public constructor({ head, headDir }: WormParams) {
    this.head = new p5.Vector(head.x, head.y);
    // this.length = length;
    this.headDir = headDir;
  }

  public get body() {
    return [this.head, ...this.tail];
  }

  // private inspectDir(dir: RelDir) {
  //   const nextHeadDir = rotate(dir, this.headDir);
  //   const dirVec = getAbsVecFromRelDir(nextHeadDir);
  //   const nextHead = p5.Vector.add(this.head, dirVec);
  //   return {
  //     available: this.availablePositionsDict.get(nextHead),
  //     nextHeadDir,
  //     nextHead,
  //     dir,
  //   };
  // }

  public turn(dir: RelDir): this {
    this.headDir = rotate(dir, this.headDir);
    return this;
  }

  public go() {
    // if (this.length !== undefined && this.tail.length >= this.length) {
    //   return false;
    // }

    // const { available, nextHeadDir, nextHead } = this.inspectDir(dir);

    // if (available) {
    this.tail.unshift(this.head);
    this.head = this.nextHead;

    // return true;
    // }

    // return false;
  }

  public get nextHead() {
    const absDir = getAbsVecFromRelDir(this.headDir);
    return p5.Vector.add(this.head, absDir);
  }

  public goTimes(times: number) {
    for (let i = 0; i < times; i++) {
      this.go();
    }
  }

  // public goRandom(randomProvider: () => number = Math.random) {
  //   const randomDir = getRandomRelDirOrder(randomProvider)
  //     .map((x) => this.inspectDir(x))
  //     .filter((x) => x.available)[0]?.dir;

  //   if (randomDir) {
  //     this.turn(randomDir);
  //     this.go();
  //     return true;
  //   } else {
  //     return false;
  //   }
  // }
}
