import type { RandomProvider } from "@/core/models";
import { getRandomShuffle } from "@/utils/misc";
import p5 from "p5";

export function orbit(
  p: p5,
  radius: number,
  time: number,
  drawCb: (pos: p5.Vector) => void,
) {
  const pos = p.createVector(p.cos(time) * radius, 0, p.sin(time) * radius);
  p.push();
  {
    p.translate(pos);
    drawCb(pos);
  }
  p.pop();
}

export function getLocalProgress(
  totalProgress: number,
  itemsCount: number,
  itemIndex: number,
) {
  itemsCount = Math.round(itemsCount);
  itemIndex = Math.round(itemIndex);

  const curr = Math.abs(totalProgress) * itemsCount;
  let res;

  if (curr >= itemIndex + 1) {
    res = 1;
  } else if (curr < itemIndex + 1 && curr > itemIndex) {
    res = curr % 1;
  } else {
    res = 0;
  }

  return Math.sign(totalProgress) * res;
}

export type Dir = "up" | "right" | "down" | "left";

export type DirMap<T> = {
  left: T;
  right: T;
  up: T;
  down: T;
};

export const DIRS_CLOCKWISE: Dir[] = ["up", "right", "down", "left"] as const;

export function getRandomDir(randomProvider: RandomProvider = Math.random) {
  const randomIndex = Math.floor(randomProvider() * DIRS_CLOCKWISE.length);
  return DIRS_CLOCKWISE[randomIndex];
}

export function getRandomDirOrder(
  randomProvider: RandomProvider = Math.random,
) {
  return getRandomShuffle(DIRS_CLOCKWISE.length, randomProvider).map(
    (i) => DIRS_CLOCKWISE[i],
  );
}

export function getAbsVecFromDir(dir: Dir) {
  return {
    up: new p5.Vector(0, 1),
    down: new p5.Vector(0, -1),
    right: new p5.Vector(-1, 0),
    left: new p5.Vector(1, 0),
  }[dir];
}

export function getDirFromAbsVec(vec: p5.Vector): Dir {
  vec = vec.copy().normalize();

  if (vec.x === 0 && vec.y === 1) {
    return "up";
  } else if (vec.x === 0 && vec.y === -1) {
    return "down";
  } else if (vec.x === -1 && vec.y === 0) {
    return "right";
  } else if (vec.x === 1 && vec.y === 0) {
    return "left";
  } else {
    throw new Error(
      `invalid vector to extract direction from: (${vec.x}, ${vec.y})`,
    );
  }
}

export function rotate(rotationDir: Dir, targetDir: Dir): Dir {
  const delta = DIRS_CLOCKWISE.indexOf(targetDir);
  const dirIndex = DIRS_CLOCKWISE.indexOf(rotationDir);
  return DIRS_CLOCKWISE[(dirIndex + delta) % 4];
}

export function drawGrid(
  p: p5,
  args: {
    size: p5.Vector;
    cells: p5.Vector;
    drawCb: (index: p5.Vector) => void;
  },
) {
  p.push();
  {
    p.scale(args.size);
    p.scale(1 / args.cells.x, 1 / args.cells.y, 1 / args.cells.z);
    p.translate(-args.cells.x / 2, -args.cells.y / 2, -args.cells.z / 2);
    p.translate(0.5, 0.5, 0.5);

    for (let xi = 0; xi < args.cells.x; xi++) {
      p.push();
      {
        for (let yi = 0; yi < args.cells.y; yi++) {
          p.push();
          {
            for (let zi = 0; zi < args.cells.z; zi++) {
              const index = p.createVector(xi, yi, zi);
              p.push();
              {
                args.drawCb(index);
              }
              p.pop();
              p.translate(0, 0, 1);
            }
          }
          p.pop();
          p.translate(0, 1, 0);
        }
      }
      p.pop();
      p.translate(1, 0, 0);
    }
  }
  p.pop();
}
