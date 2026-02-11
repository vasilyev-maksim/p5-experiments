import p5 from "p5";

export class Worm {
  public readonly tail: p5.Vector[] = [];
  public constructor(
    public head: p5.Vector,
    private readonly length: number,
    private readonly sensor: (pos: p5.Vector) => number,
  ) {}

  public get body() {
    return [this.head, ...this.tail];
  }

  public step(cb: (pos: p5.Vector) => void): boolean {
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
          weight: this.sensor(nextHead),
        };
      })
      .filter((x) => x.weight > 0)
      .sort((a, b) => a.weight - b.weight)
      .map((x) => x.head)[0];

    if (next) {
      this.tail.unshift(this.head);
      this.head = next;
      cb(this.head);
      return true;
    } else {
      return false;
    }
  }
}
