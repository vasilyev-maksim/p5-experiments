import type { RandomProvider } from "@/core/models";
import p5 from "p5";

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
