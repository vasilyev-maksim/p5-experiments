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
