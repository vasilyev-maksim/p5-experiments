import type p5 from "p5";

export function orbit(
  p: p5,
  radius: number,
  time: number,
  drawCb: (pos: p5.Vector) => void,
) {
  const pos = p.createVector(p.cos(time) * radius, 0, p.sin(time) * radius);
  p.push();
  {
    console.log(pos);
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

export function mapDirection<T>(
  dir: p5.Vector,
  map: { [k in "up" | "down" | "left" | "right"]: T },
): T {
  if (dir.x === 1 && dir.y === 0) {
    return map["right"];
  } else if (dir.x === -1 && dir.y === 0) {
    return map["left"];
  } else if (dir.x === 0 && dir.y === -1) {
    return map["up"];
  } else if (dir.x === 0 && dir.y === 1) {
    return map["down"];
  } else {
    throw new Error(`Invalid direction: (${dir.x}, ${dir.y})`);
  }
}
