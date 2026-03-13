import p5 from "p5";
import { getAbsVecFromDir, getDirFromAbsVec, rotate, type Dir } from "../utils";

export type WormParams = {
  head: p5.Vector;
  headDir: Dir;
  tail?: p5.Vector[];
};

export class Worm {
  public readonly tail: p5.Vector[] = [];
  public head;
  public headDir;
  public length;

  public constructor({ head, headDir, tail = [] }: WormParams) {
    this.head = new p5.Vector(head.x, head.y);
    this.headDir = headDir;
    this.tail = tail.map(({ x, y }) => new p5.Vector(x, y));
    this.length = this.tail.length;
  }

  public get body() {
    return [this.head, ...this.tail];
  }

  public turn(dir: Dir): this {
    this.headDir = rotate(dir, this.headDir);
    return this;
  }

  public go() {
    if (this.prevHeadDir !== this.headDir) {
      this.tail.unshift(this.head);
    }
    this.head = this.nextHead;
    this.length++;
  }

  public reversed(worm: Worm): Worm {
    const [head, ...tail] = worm.body.reverse();
    return new Worm({
      head,
      tail,
      headDir: worm.headDir,
    });
  }

  private get nextHead() {
    const absDir = getAbsVecFromDir(this.headDir);
    return p5.Vector.add(this.head, absDir);
  }

  private get prevHeadDir() {
    if (this.tail.length > 0) {
      return getDirFromAbsVec(
        p5.Vector.sub(this.head, this.tail[0]).normalize(),
      );
    } else {
      return null;
    }
  }
}
