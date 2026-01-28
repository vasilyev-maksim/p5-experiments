import type p5 from "p5";
import type { ISketchFactory } from "../../models";
import { MemoizedValue } from "../utils/MemoizedValue";
import { createSketch } from "../utils/createSketch";
import { type Params, controls } from "./controls";
import { AnimatedValue } from "../utils/AnimatedValue";
import { MemoizedAnimatedValue } from "../utils/MemoizedAnimatedValue";

export const factory: ISketchFactory<Params> = createSketch<
  Params,
  { PARTS: number[] },
  { gapY: number; gapX: number; period: number; amplitude: number }
>(() => {
  const animatedParts: AnimatedValue[] = [];

  return {
    setup: ({ p }) => {
      p.noStroke();
    },
    memosFactory: ({ p, getTrackedProp, getTime }) => {
      return {
        PARTS: new MemoizedValue(
          (resolution: number, dispersion: number) => {
            const parts = getRandomPartition(p, resolution, dispersion);
            const time = getTime();

            console.log({ parts });

            parts.forEach((x, i) => {
              if (!animatedParts[i]) {
                animatedParts[i] = new AnimatedValue(10, x);
              } else {
                animatedParts[i].animateTo(x, time);
              }
            });

            return parts;
          },
          [getTrackedProp("RESOLUTION"), getTrackedProp("W_DISPERSION")],
        ),
      };
    },
    animationsFactory: ({ getTrackedProp }) => {
      return {
        gapY: new MemoizedAnimatedValue(5, (x) => x, [getTrackedProp("GAP_Y")]),
        gapX: new MemoizedAnimatedValue(5, (x) => x, [getTrackedProp("GAP_X")]),
        period: new MemoizedAnimatedValue(30, (x) => x, [
          getTrackedProp("PERIOD"),
        ]),
        amplitude: new MemoizedAnimatedValue(10, (x) => x, [
          getTrackedProp("AMPLITUDE"),
        ]),
      };
    },
    drawFactory: ({ p, getProp, getTime }) => {
      function drawColumn(
        x: number,
        y: number,
        w: number,
        h: number,
        gapY: number,
        gapHeight: number,
      ) {
        const gd = gapHeight / 2;
        drawPill(x, y, w, gapY - gd, "down", "circle");
        drawPill(x, gapY + gd, w, h - gapY + gd, "up", "circle");
      }

      function drawPill(
        x: number,
        y: number,
        w: number,
        h: number,
        direction: "up" | "down",
        endStyle: "circle" | "polygon",
      ) {
        const COLOR = getProp("COLOR");
        const color = p.lerpColor(
          p.color(controls.COLOR.colors[COLOR][0]),
          p.color(controls.COLOR.colors[COLOR][1]),
          h / p.height,
        );

        p.fill(color);

        const tl = p.createVector(x, y);
        const r = w / 2;
        const c = tl
          .copy()
          .add(
            p.createVector(...(direction === "up" ? [r, r] : [w - r, h - r])),
          );
        switch (endStyle) {
          default:
          case "circle":
            p.circle(c.x, c.y, r * 2);
            break;
          case "polygon":
            p.push();
            {
              p.translate(c.x, c.y);
              p.beginShape();
              for (let a = 0; a <= p.PI; a += p.PI / 3) {
                const sx = p.cos(a) * r;
                const sy = p.sin(a) * r * (direction === "up" ? -1 : 1);
                p.vertex(sx, sy);
              }
              p.endShape("close");
            }
            p.pop();
            break;
        }

        const rtl =
          direction === "up" ? tl.copy().add(p.createVector(0, r)) : tl;
        p.rect(rtl.x, rtl.y, w, Math.max(h - r, 0));
      }

      return () => {
        const GAP_X = (getProp("gapX") * p.width) / 1158,
          GAP_Y = (getProp("gapY") * p.height) / 811,
          AMPLITUDE = getProp("amplitude"),
          PERIOD = getProp("period"),
          time = getTime();

        p.background("black");

        const totalWidth = p.width - GAP_X;
        let start = GAP_X;

        animatedParts.forEach((animatedWidthNormalized, i, { length }) => {
          const x = start,
            y = 0,
            // widthNormalized = _w,
            widthNormalized = animatedWidthNormalized.getCurrentValue()!,
            w = widthNormalized * totalWidth - GAP_X,
            h = p.height,
            gapX =
              p.height / 2 +
              p.map(
                AMPLITUDE,
                controls.AMPLITUDE.min,
                controls.AMPLITUDE.max,
                0,
                p.height / 2,
              ) *
                p.sin((p.TWO_PI * PERIOD * i) / length + time * 0.015);

          drawColumn(x, y, w, h, gapX, GAP_Y);
          start += widthNormalized * totalWidth;

          // console.log(animatedWidthNormalized.getCurrentValue()!);

          animatedWidthNormalized.runAnimationStep(time);
          // animatedWidthNormalized.nextStep();
        });
      };
    },
  };
});

export function getRandomPartition(
  p: p5,
  partsCount: number,
  dispersion: number,
): number[] {
  if (dispersion < 0 || dispersion > 1) {
    throw Error(
      `Invalid dispersion value "${dispersion}", should be < 0 and > 1`,
    );
  }

  const min = (1 - dispersion) / partsCount;
  const max = (1 + dispersion) / partsCount;

  function r(n: number, remainder: number): number[] {
    if (n <= 1) {
      return [remainder];
    }

    const _max = Math.min(max, remainder - min * (n - 1));
    if (min - _max > 0.00001) {
      throw Error(
        `No sufficient range left for partition (for n = ${n}, reminder = ${remainder}, min = ${min}, _max = ${_max})`,
      );
    }
    const curr = p.map(p.random(), 0, 1, min, _max);

    return [curr, ...r(n - 1, remainder - curr)];
  }

  const res = r(partsCount, 1);
  return res;
}
