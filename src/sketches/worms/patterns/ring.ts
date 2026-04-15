import { Worm } from "../Worm";
import type { PatternArgs } from ".";
import { WormNavigator } from "../WormNavigator";
import { OccupancyGrid } from "@utils/OccupancyGrid";
import { Vector } from "@utils/Vector";

export const ringPattern =
  ({
    inverted,
    innerRadius,
    outerRadius,
    attractorX,
    attractorY,
  }: {
    inverted: boolean;
    innerRadius: number;
    outerRadius: number;
    attractorX: number;
    attractorY: number;
  }) =>
  ({ len, randomProvider, resX, resY }: PatternArgs): Worm[] => {
    const occupancyGrid = new OccupancyGrid(resX, resY, randomProvider);
    const navigator = new WormNavigator(occupancyGrid, randomProvider);
    const attractor = new Vector(
      Math.floor(resX * attractorX),
      Math.floor(resY * attractorY),
    );
    const worms: Worm[] = [];

    occupyRing({ occupancyGrid, outerRadius, innerRadius, inverted });

    let worm: Worm | null;

    while (true) {
      worm = navigator.spawnWormRandomly();

      if (worm) {
        worms.push(worm);

        while (worm.length < len && navigator.goToAttractor(worm, attractor));
      } else {
        break;
      }
    }

    return worms;
  };

function occupyRing({
  occupancyGrid,
  outerRadius,
  innerRadius,
  inverted,
}: {
  occupancyGrid: OccupancyGrid;
  outerRadius: number;
  innerRadius: number;
  inverted: boolean;
}) {
  const W = occupancyGrid.width;
  const H = occupancyGrid.height;
  const halfW = Math.floor(W / 2);
  const halfH = Math.floor(H / 2);
  const R = H / 2;

  for (let x = 0; x < W; x++) {
    for (let y = 0; y < H; y++) {
      const curr = new Vector(x, y);
      const center = new Vector(halfW, halfH);
      const dist = center.sub(curr).mag();

      if (dist > R * outerRadius || dist < R * innerRadius) {
        if (!inverted) {
          occupancyGrid.occupy(curr);
        }
      } else {
        if (inverted) {
          occupancyGrid.occupy(curr);
        }
      }
    }
  }
}
