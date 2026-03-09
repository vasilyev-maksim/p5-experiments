import p5 from "p5";
import { getAbsVecFromDir, rotate, type Dir } from "../utils";

export type WormParams = {
  head: p5.Vector;
  headDir: Dir;
  tail?: p5.Vector[];
};

export class Worm {
  public readonly tail: p5.Vector[] = [];
  public head;
  public headDir;

  public constructor({ head, headDir, tail = [] }: WormParams) {
    this.head = new p5.Vector(head.x, head.y);
    this.headDir = headDir;
    this.tail = tail.map(({ x, y }) => new p5.Vector(x, y));
  }

  public get body() {
    return [this.head, ...this.tail];
  }

  public get nextHead() {
    const absDir = getAbsVecFromDir(this.headDir);
    return p5.Vector.add(this.head, absDir);
  }

  public turn(dir: Dir): this {
    this.headDir = rotate(dir, this.headDir);
    return this;
  }

  public go() {
    this.tail.unshift(this.head);
    this.head = this.nextHead;
  }

  public reversed(worm: Worm): Worm {
    const [head, ...tail] = worm.body.reverse();
    return new Worm({
      head,
      tail,
      headDir: worm.headDir,
    });
  }
}
