import p5 from "p5";
import { getDirFromAbsVec } from "../utils";

export type WormParams = {
  head: p5.Vector;
  tail?: p5.Vector[];
  length?: number;
};

export class Worm {
  public readonly tail: p5.Vector[] = [];
  public head;
  public length;

  public constructor({ head, tail = [], length = tail.length }: WormParams) {
    this.head = new p5.Vector(head.x, head.y);
    this.tail = tail.map(({ x, y }) => new p5.Vector(x, y));
    this.length = length;
  }

  public get body() {
    return [this.head, ...this.tail];
  }

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
}
