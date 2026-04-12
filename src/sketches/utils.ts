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
export function drawVec(
  p: p5,
  origin: p5.Vector,
  vec: p5.Vector,
  color: string,
) {
  const arrowSize = 7;

  p.push();
  {
    p.stroke(color);
    p.strokeWeight(3);
    p.fill(color);
    p.translate(origin.x, origin.y);
    p.line(0, 0, vec.x, vec.y);
    p.rotate(vec.heading());
    p.translate(vec.mag() - arrowSize, 0);
    p.triangle(0, arrowSize / 2, 0, -arrowSize / 2, arrowSize, 0);
  }
  p.pop();
}
