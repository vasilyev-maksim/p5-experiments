import { getRandomPartition } from "./utils";
import type { ISketchFactory } from "../models";

export const pillars: ISketchFactory =
  (WIDTH, HEIGHT, randomSeed, timeShift) => (p) => {
    const GAP_X = 10,
      GAP_Y = 10,
      MIN_W = WIDTH / 20,
      MAX_W = WIDTH / 10;
    let PARTS: number[];

    p.updateWithProps = (props) => {
      if (props.playing) {
        p.loop();
      } else {
        p.noLoop();
      }
    };

    p.setup = () => {
      p.createCanvas(WIDTH, HEIGHT);
      p.noStroke();
      p.randomSeed(randomSeed);
      PARTS = getRandomPartition(WIDTH, MIN_W, MAX_W, () => p.random());
    };

    p.draw = () => {
      const time = p.frameCount + timeShift;

      p.background("black");

      let start = 0;
      PARTS.forEach((w, i) => {
        drawColumn(
          start,
          0,
          w - GAP_X,
          HEIGHT,
          HEIGHT / 2 +
            (HEIGHT / 4) *
              p.sin((p.PI * i * 2) / PARTS.length + p.PI * time * 0.005),
          GAP_Y
        );
        start += w;
      });

      function drawColumn(
        x: number,
        y: number,
        w: number,
        h: number,
        gapY: number,
        gapH: number
      ) {
        const gd = gapH / 2;
        drawPill(x, y, w, gapY - gd, "down");
        drawPill(x, gapY + gd, w, h - gapY + gd, "up");
      }

      function drawPill(
        x: number,
        y: number,
        w: number,
        h: number,
        direction: "up" | "down"
      ) {
        const color = p.lerpColor(
          p.color("rgba(52, 9, 152, 1)"),
          p.color("rgba(234, 114, 247, 1)"),
          h / HEIGHT
        );

        p.fill(color);

        const tl = p.createVector(x, y);
        const r = w / 2,
          c = tl
            .copy()
            .add(
              p.createVector(...(direction === "up" ? [r, r] : [w - r, h - r]))
            );
        p.circle(c.x, c.y, r * 2);

        const rtl =
          direction === "up" ? tl.copy().add(p.createVector(0, r)) : tl;
        p.rect(rtl.x, rtl.y, w, Math.max(h - r, 0));
      }
    };
  };
