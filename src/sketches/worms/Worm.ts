import p5 from "p5";
import { getDirFromAbsVec } from "../utils";

export type WormParams = {
  head: p5.Vector;
  // headDir: Dir;
  tail?: p5.Vector[];
};

export class Worm {
  public readonly tail: p5.Vector[] = [];
  public head;
  // public headDir;
  public length;

  public constructor({ head, tail = [] }: WormParams) {
    this.head = new p5.Vector(head.x, head.y);
    // this.headDir = headDir;
    this.tail = tail.map(({ x, y }) => new p5.Vector(x, y));
    this.length = this.tail.length;
  }

  public get body() {
    return [this.head, ...this.tail];
  }

  // public turn(dir: Dir): this {
  //   this.headDir = rotate(dir, this.headDir);
  //   return this;
  // }

  // public go() {
  //   // optimization: no need to store A,B,C,D if they lay on the same line,
  //   // can store only A & D
  //   if (this.prevHeadDir !== this.headDir) {
  //     this.tail.unshift(this.head);
  //   }

  //   this.head = this.nextHead;
  //   this.length++;
  // }

  public goTo(dest: p5.Vector) {
    const newDir = p5.Vector.sub(dest, this.head).normalize();

    if (
      this.headDirVec === null ||
      p5.Vector.equals(this.headDirVec, newDir) === false
    ) {
      // optimization: no need to store A,B,C,D if they lay on the same line,
      // can store only A & D
      this.tail.unshift(this.head);
    }

    this.head = dest;
    this.length++;
  }

  public reversed(worm: Worm): Worm {
    const [head, ...tail] = worm.body.reverse();
    return new Worm({
      head,
      tail,
    });
  }

  public get headDirVec() {
    return this.tail.length > 0
      ? p5.Vector.sub(this.head, this.tail[0]).normalize()
      : null;
  }

  public get headDir() {
    return this.headDirVec ? getDirFromAbsVec(this.headDirVec) : null;
  }

  // private get nextHead() {
  //   const absDir = getAbsVecFromDir(this.headDir);
  //   return p5.Vector.add(this.head, absDir);
  // }

  // private get prevHeadDir() {
  //   if (this.tail.length > 0) {
  //     return getDirFromAbsVec(
  //       p5.Vector.sub(this.head, this.tail[0]).normalize(),
  //     );
  //   } else {
  //     return null;
  //   }
  // }
}
