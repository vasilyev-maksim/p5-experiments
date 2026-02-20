import type p5 from "p5";
import { createSketch } from "@core/createSketch";
import { type Controls, controls } from "./controls";

const ANIMATION_SPEED = 25;

export const factory = createSketch<Controls>(
  ({
    createAnimatedArray,
    createAnimatedColors,
    createAnimatedValue,
    createMemo,
    getTime,
    getTrackedProp,
    getCanvasSize,
    p,
  }) => {
    const { trackedCanvasHeight, trackedCanvasWidth } = getCanvasSize();
    const widthData = createMemo({
      fn: (resolution, dispersion) =>
        getRandomPartition(p, resolution, dispersion),
      deps: [getTrackedProp("RESOLUTION"), getTrackedProp("W_DISPERSION")],
    });
    const widthsAnimated = createAnimatedArray({
      animationDuration: ANIMATION_SPEED,
      fn: (x) => x,
      deps: [widthData.getTrackedValue()],
    });
    const amplitudeAnimated = createAnimatedValue({
      animationDuration: ANIMATION_SPEED,
      fn: (x) => x,
      deps: [getTrackedProp("AMPLITUDE")],
    });
    const gapYsAnimated = createAnimatedArray({
      animationDuration: ANIMATION_SPEED,
      fn: (parts, period) =>
        parts.map((_, i, { length }) => (p.TWO_PI * period * i) / length),
      deps: [widthData.getTrackedValue(), getTrackedProp("PERIOD")],
    });
    const gapWidthAnimated = createAnimatedValue({
      animationDuration: ANIMATION_SPEED,
      fn: (x, canvasWidth) => (x * canvasWidth) / 1158,
      deps: [getTrackedProp("GAP_X"), trackedCanvasWidth],
    });
    const gapHeightAnimated = createAnimatedValue({
      animationDuration: ANIMATION_SPEED,
      fn: (x, canvasHeight) => (x * canvasHeight) / 811,
      deps: [getTrackedProp("GAP_Y"), trackedCanvasHeight],
    });
    const colorsAnimated = createAnimatedColors({
      animationDuration: ANIMATION_SPEED,
      deps: [getTrackedProp("COLOR")],
      colorProvider: (x) => controls.COLOR.colors[x],
      p,
    });

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
      const [colorA, colorB] = colorsAnimated.getValue();
      const color = p.lerpColor(p.color(colorA), p.color(colorB), h / p.height);

      p.fill(color);

      const tl = p.createVector(x, y);
      const r = w / 2;
      const c = tl
        .copy()
        .add(p.createVector(...(direction === "up" ? [r, r] : [w - r, h - r])));
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

      const rtl = direction === "up" ? tl.copy().add(p.createVector(0, r)) : tl;
      p.rect(rtl.x, rtl.y, w, Math.max(h - r, 0));
    }

    return {
      setup: () => {
        p.noStroke();
      },
      draw: () => () => {
        const GAP_WIDTH = gapWidthAnimated.getValue(),
          gapHeight = gapHeightAnimated.getValue(),
          AMPLITUDE = amplitudeAnimated.getValue(),
          time = getTime();

        p.background("black");

        const totalWidth = p.width - GAP_WIDTH;
        let start = GAP_WIDTH;
        const gapYArr = gapYsAnimated.getValue();

        widthsAnimated.getValue().forEach((widthAnimated, i) => {
          const x = start,
            y = 0,
            width = widthAnimated * totalWidth,
            w = width - GAP_WIDTH,
            h = p.height,
            gapY =
              p.height / 2 +
              p.map(
                AMPLITUDE,
                controls.AMPLITUDE.min,
                controls.AMPLITUDE.max,
                0,
                p.height / 2,
              ) *
                p.sin(gapYArr[i] + time * 0.015);

          drawColumn(x, y, w, h, gapY, gapHeight);
          start += width;
        });
      },
    };
  },
);

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
