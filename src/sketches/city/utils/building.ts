import p5 from "p5";
import { drawMaterial } from "./material";
import { drawWindow } from "./window";
import { drawGrid } from "@/sketches/utils";

export function drawBuilding(p: p5, { size }: { size: p5.Vector }) {
  const windowAreaHeight = (size.y - 1) / size.y;
  const [sx, sy, sz] = size.array().map((x) => Math.floor(x));
  const windowsCount = p.createVector(sx, sy - 1, 1);
  const sideWindowsCount = p.createVector(sz, sy - 1, 1);
  const windowDepth = 0.15 / sz;
  const sideWindowDepth = 0.15 / sx;

  p.push();
  {
    p.scale(size);

    // building box
    drawMaterial(
      p,
      () => {
        p.box(1, 1, 1);
      },
      "sand",
    );

    const windowsAreaSize = p.createVector(1, windowAreaHeight, windowDepth);
    p.push();
    {
      p.translate(0, windowsAreaSize.y / 2 - 0.5, 0.5 + windowsAreaSize.z / 2);
      drawGrid(p, {
        size: windowsAreaSize,
        cells: windowsCount,
        drawCb: () =>
          drawWindow(p, {
            size: p.createVector(0.5, 0.7, 1),
            frameWidth: 0.8,
            railWidth: 0.1,
            railHeight: 0.05,
            visorSize: p.createVector(1, 0.05, 1),
            sillSize: p.createVector(0.9, 0.1, 0.8),
          }),
      });
    }
    p.pop();

    const sideWindowsAreaSize = p.createVector(
      1,
      windowAreaHeight,
      sideWindowDepth,
    );

    p.push();
    {
      p.translate(
        0.5 + sideWindowsAreaSize.z / 2,
        sideWindowsAreaSize.y / 2 - 0.5,
        sideWindowsAreaSize.x / 2 - 0.5,
      );
      p.rotateY(p.HALF_PI);
      drawGrid(p, {
        size: sideWindowsAreaSize,
        cells: sideWindowsCount,
        drawCb: () =>
          drawWindow(p, {
            size: p.createVector(0.5, 0.7, 1),
            frameWidth: 0.8,
            railWidth: 0.1,
            railHeight: 0.05,
            visorSize: p.createVector(1, 0.05, 1),
            sillSize: p.createVector(0.9, 0.1, 0.8),
          }),
      });
    }
    p.pop();
  }
  p.pop();
}
