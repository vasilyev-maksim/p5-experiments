import type p5 from "p5";

export function drawCoordinatesGrid(p: p5, resX: number, resY: number) {
  p.push();
  {
    p.stroke("white");
    p.strokeWeight(0.01);
    for (let x = 0; x <= resX; x++) {
      p.line(x, 0, x, resY);
    }
    for (let y = 0; y <= resY; y++) {
      p.line(0, y, resX, y);
    }
    // p.strokeWeight(0.1);
    // p.circle((resX - 1) / 2, (resY - 1) / 2, 0.5);
  }
  p.pop();
}
