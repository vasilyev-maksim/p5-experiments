import type p5 from "p5";

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
