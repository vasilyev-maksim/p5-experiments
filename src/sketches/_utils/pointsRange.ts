import { Vector } from "@utils/Vector";

export function pointsRange(start: Vector, end: Vector): Vector[] {
  const points = [];
  const dx = Math.sign(start.x - end.x);
  const dy = Math.sign(start.y - end.y);

  for (let x = start.x; x <= end.x; x += dx) {
    for (let y = start.y; y <= end.y; y += dy) {
      points.push(new Vector(x, y));
    }
  }
  return points;
}
