import p5 from "p5";
import { getAbsVecFromRelDir, type RelDir, rotate } from "../utils";

export type Worm2Params = {
  head: p5.Vector;
  headDir: RelDir;
  tail?: p5.Vector[];
};

export class Worm2 {
  public tail: p5.Vector[];
  public head;
  public headDir;

  public constructor({ head, headDir, tail = [] }: Worm2Params) {
    this.head = new p5.Vector(head.x, head.y);
    this.headDir = headDir;
    this.tail = tail.map(({ x, y }) => new p5.Vector(x, y));
  }

  public turn(dir: RelDir) {
    this.headDir = rotate(dir, this.headDir);
    return this;
  }

  public go(destination?: p5.Vector) {
    const nextHead = destination
      ? new p5.Vector(destination?.x, destination?.y)
      : this.nextHead;
    this.tail.unshift(this.head);
    this.head = nextHead;
  }

  public get body() {
    return [this.head, ...this.tail];
  }

  public get nextHead() {
    const absDir = getAbsVecFromRelDir(this.headDir);
    return p5.Vector.add(this.head, absDir);
  }

  public static reversed(worm: Worm2): Worm2 {
    const [head, ...tail] = worm.body.reverse();
    return new Worm2({
      head,
      tail,
      headDir: worm.headDir,
    });
  }
}
