import p5 from "p5";
import { drawPanel } from "./panel";
import { drawFrame } from "./frame";
import { drawMaterial } from "./material";

export function drawWindow(
  p: p5,
  {
    size,
    frameWidth,
    railWidth,
    railHeight,
    visorSize,
    sillSize,
  }: {
    size: p5.Vector;
    frameWidth: number;
    railWidth: number;
    railHeight: number;
    visorSize: p5.Vector;
    sillSize: p5.Vector;
  },
) {
  p.push();
  {
    p.scale(size);
    // p.translate(0, 0, 0.5);

    /** debug */
    // const oneVector = p.createVector(1, 1, 1);
    // p.noFill();
    // p.stroke("white");
    // p.box(...oneVector.array());

    const visorOrigin = p.createVector(
      0,
      visorSize.y / 2 - 0.5,
      visorSize.z / 2 - 0.5,
    );
    p.push();
    {
      p.translate(visorOrigin);
      drawPanel(p, visorSize, "stone");
    }
    p.pop();

    const sillOrigin = p.createVector(
      0,
      0.5 - sillSize.y / 2,
      sillSize.z / 2 - 0.5,
    );
    p.push();
    {
      p.translate(sillOrigin);
      drawPanel(p, sillSize, "stone");
    }
    p.pop();

    const frameSize = p.createVector(
      frameWidth,
      1 - (visorSize.y + sillSize.y),
      0.2,
    );
    const frameOrigin = p.createVector(
      0,
      0.5 - (sillSize.y + frameSize.y / 2),
      frameSize.z / 2 - 0.5,
    );
    p.push();
    {
      p.translate(frameOrigin);
      drawFrame(p, {
        size: frameSize,
        railHeight,
        railWidth,
        material: "plastic",
      });
    }
    p.pop();

    const glassSize = p.createVector(
      frameSize.x * (1 - railWidth * 2),
      frameSize.y * (1 - railHeight * 2),
    );
    const glassOrigin = p.createVector(frameOrigin.x, frameOrigin.y, -0.49); // TODO: fix to -0.5
    p.push();
    {
      p.translate(glassOrigin);
      drawMaterial(
        p,
        () => {
          p.plane(glassSize.x, glassSize.y);
        },
        "glass",
      );
    }
    p.pop();
  }
  p.pop();
}
