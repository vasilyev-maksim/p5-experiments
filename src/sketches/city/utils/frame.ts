import p5 from "p5";
import { drawPanel } from "./panel";
import type { MaterialType } from "./material";

export function drawFrame(
  p: p5,
  {
    size,
    railWidth,
    railHeight,
    material,
  }: {
    size: p5.Vector;
    railWidth: number;
    railHeight: number;
    material: MaterialType;
  },
) {
  p.push();
  {
    p.scale(size);

    /** debug */
    // const oneVector = p.createVector(1, 1, 1);
    // p.noFill();
    // p.stroke("white");
    // p.box(...oneVector.array());

    const lo = p.createVector(-(1 - railWidth) / 2, 0, 0);
    const ls = p.createVector(railWidth, 1, 1);
    p.push();
    {
      p.translate(lo);
      drawPanel(p, ls, material);
    }
    p.pop();

    const ro = lo.mult(-1);
    p.push();
    {
      p.translate(ro);
      drawPanel(p, ls, material);
    }
    p.pop();

    const ts = p.createVector(1, railHeight, 1);
    const to = p.createVector(0, -(1 - railHeight) / 2, 0);
    p.push();
    {
      p.translate(to);
      drawPanel(p, ts, material);
    }
    p.pop();

    const bo = to.mult(-1);
    p.push();
    {
      p.translate(bo);
      drawPanel(p, ts, material);
    }
    p.pop();

    // p.translate(p.createVector());
  }
  p.pop();
}
