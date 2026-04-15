import type p5 from "p5";

export function drawVector(
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
