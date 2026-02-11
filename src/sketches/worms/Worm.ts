import p5 from "p5";
import { getLocalProgress } from "../utils";

export class Worm {
  public readonly tail: p5.Vector[] = [];
  public constructor(
    public head: p5.Vector,
    private readonly length: number,
    private readonly sensorCb: (pos: p5.Vector, worm: Worm) => number,
    private readonly commitCb: (pos: p5.Vector) => void,
  ) {
    this.commitCb(this.head);
  }

  public get body() {
    return [this.head, ...this.tail];
  }

  public get tailEnd() {
    return this.tail[this.tail.length - 1];
  }

  public pushTail(arr: p5.Vector[]): this {
    this.tail.push(...arr);
    return this;
  }

  public grow(): this {
    while (this.growOneStep()) {
      // noop
    }
    return this;
  }

  public growOneStep(): boolean {
    if (this.tail.length >= this.length) {
      return false;
    }

    const next = [
      new p5.Vector(1, 0),
      new p5.Vector(0, 1),
      new p5.Vector(-1, 0),
      new p5.Vector(0, -1),
    ]
      .map((direction) => {
        const nextHead = p5.Vector.add(this.head, direction);
        return {
          head: nextHead,
          weight: this.sensorCb(nextHead, this),
        };
      })
      .filter((x) => x.weight > 0)
      .sort((a, b) => b.weight - a.weight)
      .map((x) => x.head)[0];

    if (next) {
      this.tail.unshift(this.head);
      this.head = next;
      this.commitCb(this.head);
      return true;
    } else {
      return false;
    }
  }

  public draw(p: p5, progress: number): void {
    p.beginShape();
    {
      const body = progress >= 0 ? this.body : [...this.body].reverse();
      const absProgress = 1 - p.abs(progress);

      p.vertex(body[0].x, body[0].y);

      body.forEach((pos, i, arr) => {
        const localProgress =
          i === 0
            ? 1
            : getLocalProgress(absProgress, this.body.length - 1, i - 1);

        if (localProgress === 0) {
          return;
        }

        const prev = i === 0 ? arr[0] : arr[i - 1];
        const int = p5.Vector.lerp(prev, pos, localProgress);

        p.vertex(int.x, int.y);
      });
    }
    p.endShape();
  }
}
