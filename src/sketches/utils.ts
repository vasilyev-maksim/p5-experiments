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
