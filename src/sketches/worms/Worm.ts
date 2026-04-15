import { getDirFromAbsVec } from "./utils";
import { Vector } from "@/utils/Vector";

export type WormParams = {
  head: Vector;
  tail?: Vector[];
  length?: number;
};

export class Worm {
  public readonly tail: Vector[] = [];
  public head;
  public length;

  public constructor({ head, tail = [], length = tail.length }: WormParams) {
    this.head = new Vector(head.x, head.y);
    this.tail = tail.map(({ x, y }) => new Vector(x, y));
    this.length = length;
  }

  public get body() {
    return [this.head, ...this.tail];
  }

  public goTo(dest: Vector) {
    const newDir = dest.sub(this.head).normalize();

    if (this.headDirVec === null || this.headDirVec.equals(newDir) === false) {
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
      ? this.head.sub(this.tail[0]).normalize()
      : null;
  }

  public get headDir() {
    return this.headDirVec ? getDirFromAbsVec(this.headDirVec) : null;
  }
}
