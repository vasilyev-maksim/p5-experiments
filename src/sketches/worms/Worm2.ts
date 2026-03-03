import p5 from "p5";
import { getAbsVecFromRelDir, type RelDir, rotate } from "../utils";

export type Worm2Params = {
  head: p5.Vector;
  headDir: RelDir;
  delay?: number;
  tail?: p5.Vector[];
};

export class Worm2 {
  public tail: p5.Vector[];
  public head;
  public headDir;
  public delay;

  public constructor({ head, headDir, delay, tail = [] }: Worm2Params) {
    this.head = new p5.Vector(head.x, head.y);
    this.headDir = headDir;
    this.delay = delay;
    this.tail = tail.map(({ x, y }) => new p5.Vector(x, y));
  }

  public turn(dir: "left" | "right") {
    this.headDir = rotate(dir, this.headDir);
    return this;
  }

  public go(destination?: p5.Vector) {
    const nextHead = destination
      ? new p5.Vector(destination?.x, destination?.y)
      : p5.Vector.add(this.head, getAbsVecFromRelDir(this.headDir));
    this.tail.unshift(this.head);
    this.head = nextHead;
  }

  public get body() {
    return [this.head, ...this.tail];
  }
}
