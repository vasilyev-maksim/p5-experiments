import type { OccupancyGrid } from "@utils/OccupancyGrid";
import { Vector } from "@utils/Vector";
import { Rectangle } from "@utils/Rectangle";

export class Tiler {
  constructor(
    public readonly occupancyGrid: OccupancyGrid,
    private readonly tileEvaluator: (tile: Rectangle) => number,
  ) {}

  public randomTiling(): Rectangle[] {
    const tiles: Rectangle[] = [];
    while (true) {
      const tile = this.spawnRandomTile();
      if (tile) {
        tiles?.push(tile);
      } else {
        break;
      }
    }
    return tiles;
  }

  public spawnRandomTile(): Rectangle | null {
    const start = this.occupancyGrid.getRandomFreeCell();
    if (start) {
      const ends = this.getEndVariations(start);
      // console.log(ends);

      const end = ends?.[0];
      if (end) {
        this.occupancyGrid.occupyRange(start, end);
        const rect = new Rectangle(start, end);
        return rect;
      } else {
        return null;
      }
    } else {
      return null;
    }
  }

  public getEmptyPathLengthByDirection(start: Vector, direction: Vector) {
    if (direction.mag() === 0) return 0;

    let length = 0;
    let current = start;

    while (true) {
      current = current.add(direction);

      if (this.occupancyGrid.isOccupied(current)) {
        break;
      } else {
        length++;
      }
    }

    return length;
  }

  public getEndVariations(start: Vector) {
    return (
      [
        ...this.getEndVariationsByDirection(start, new Vector(1, 1)),
        ...this.getEndVariationsByDirection(start, new Vector(-1, 1)),
        ...this.getEndVariationsByDirection(start, new Vector(1, -1)),
        ...this.getEndVariationsByDirection(start, new Vector(-1, -1)),
      ]
        // filter out duplicates
        .filter((x, i, arr) => arr.findIndex((y) => x.equals(y)) === i)
        .map((end) => {
          const weight = this.tileEvaluator(new Rectangle(start, end));
          return { end, weight };
        })
        .filter(({ weight }) => weight > 0)
        .sort((a, b) => b.weight - a.weight)
        .map((x) => x.end)
    );
  }

  public getEndVariationsByDirection(start: Vector, direction: Vector) {
    const directionX = direction.x;
    const directionY = direction.y;

    let maxDY = this.getEmptyPathLengthByDirection(
      start,
      new Vector(0, directionY),
    );
    const maxDX = this.getEmptyPathLengthByDirection(
      start,
      new Vector(directionX, 0),
    );
    const ends = [];

    for (let dx = 0; dx <= maxDX; dx++) {
      const x = start.x + dx * directionX;

      for (let dy = 0; dy <= maxDY; dy++) {
        const y = start.y + dy * directionY;
        const isOccupied = this.occupancyGrid.isOccupied(new Vector(x, y));

        if (isOccupied) {
          const newMaxDY = dy - 1;
          // if (newMaxDY < maxDY) {
          //   ends.push(new Vector(x - directionX, start.y + maxDY * directionY));
          // }
          maxDY = newMaxDY;
          break;
        } else {
          ends.push(new Vector(x, y));
        }
      }
    }

    return ends;
  }
}
