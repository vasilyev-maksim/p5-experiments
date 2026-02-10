// import type { IPoint } from "./IPoint";
// import { Point } from "./Point";
import { type IRectangle, Rectangle } from "./Rectangle";
import p5 from "p5";
// import { p5.Vector } from "./p5.Vector";

interface IProviders {
  onCommit: (rectangle: IRectangle) => void;
  isForwardPossible: (cell: p5.Vector) => boolean;
  rectEvaluator: (rect: IRectangle) => number;
}

export class Turtle {
  public start: p5.Vector;

  constructor(
    public origin: p5.Vector,
    private providers: IProviders,
  ) {
    this.start = origin.copy();
    this.providers = providers;
  }

  coverRandomRectangle() {
    const rects = this.getRectangleVariations();
    this.providers.onCommit(rects[0]);
  }

  getEmptyPathLengthByDirection(direction: p5.Vector) {
    if (direction.mag() === 0) return 0;

    let length = 0;
    const current = this.start.copy();

    while (true) {
      current.add(direction);
      if (this.providers.isForwardPossible(current)) {
        length++;
      } else {
        break;
      }
    }

    return length;
  }

  getRectangleVariations() {
    return [
      ...this.getRectangleVariationsByDirection(new p5.Vector(1, 1)),
      ...this.getRectangleVariationsByDirection(new p5.Vector(-1, 1)),
      ...this.getRectangleVariationsByDirection(new p5.Vector(1, -1)),
      ...this.getRectangleVariationsByDirection(new p5.Vector(-1, -1)),
    ];
  }

  getRectangleVariationsByDirection(direction: p5.Vector) {
    const directionX = direction.x;
    const directionY = direction.y;

    let maxDY = this.getEmptyPathLengthByDirection(
      new p5.Vector(0, direction.y),
    );
    const maxDX = this.getEmptyPathLengthByDirection(
      new p5.Vector(direction.x, 0),
    );
    const variations = [];

    for (let dx = 1; dx <= maxDX; dx++) {
      const x = this.start.x + dx * directionX;
      for (let dy = 1; dy <= maxDY; dy++) {
        const y = this.start.y + dy * directionY;
        const isEmpty = this.providers.isForwardPossible(new p5.Vector(x, y));
        if (!isEmpty) {
          const newMaxDY = dy - 1;
          if (newMaxDY < maxDY) {
            variations.push(
              new p5.Vector(x - directionX, this.start.y + maxDY * directionY),
            );
          }
          maxDY = newMaxDY;
          break;
        }
      }
    }

    variations.push(
      this.start
        .copy()
        .add(new p5.Vector(maxDX * directionX, maxDY * directionY)),
    );

    return variations
      .map((x) => {
        const rect = new Rectangle(this.start, x);
        const value = this.providers.rectEvaluator(rect);
        return { rect, value };
      })
      .filter(({ value }) => value > 0)
      .sort((a, b) => a.value - b.value)
      .map((x) => x.rect);
  }
}
