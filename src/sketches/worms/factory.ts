import { createSketch } from "@/core/createSketch";
import { oscillateBetween, flatSin } from "@/core/utils";
import type { ISketchFactory } from "@/models";
import { OccupancyGrid } from "../../utils/OccupancyGrid";
import { Size } from "../tiles/Size";
import { controls, type Controls } from "./controls";
import { Worm } from "./Worm";
import p5, { type STROKE_JOIN } from "p5";
import { getLocalProgress } from "../utils";
import { patterns, type PatternArgs } from "./patterns";

const ANIMATION_SPEED = 25;
const SHRINK_OFFSET = 0.25;
const GROW_OFFSET = 0.1;

export const factory: ISketchFactory<Controls> = createSketch<Controls>(
  ({
    p,
    createMemo,
    getTrackedParam,
    getParam,
    createAnimatedValue,
    createAnimatedColors,
    getTime,
    getCanvasSize,
  }) => {
    // let i = 0;
    const { trackedCanvasHeight, trackedCanvasWidth } = getCanvasSize();
    const resolutionX = createMemo({
      fn: (w, h, r) => p.round((w * r) / h),
      deps: [
        trackedCanvasWidth,
        trackedCanvasHeight,
        getTrackedParam("RESOLUTION"),
      ],
    });
    const worms = createMemo({
      fn: (resY, resX, len, patternType, _, [r, d]) => {
        const left = 1 - r,
          right = r,
          up = 1 - d,
          down = d;
        const randomProvider = () => p.random();
        const matrix = new OccupancyGrid(new Size(resX, resY), randomProvider);

        if (len === 0) {
          return Array.from({ length: resY * resX }, (_, i) => {
            const pos = p.createVector(i % resX, p.floor(i / resX));
            return new Worm({
              head: pos,
              headDir: "up",
            });
          });
        }

        const { pattern } = patterns[patternType];
        const patternArgs: PatternArgs = {
          p,
          matrix,
          resY,
          resX,
          len,
          randomProvider,
          dirWeights: {
            left,
            right,
            up,
            down,
          },
        };
        return pattern(patternArgs);
      },
      deps: [
        getTrackedParam("RESOLUTION"),
        resolutionX.getTrackedValue(),
        getTrackedParam("LENGTH"),
        getTrackedParam("PATTERN_TYPE"),
        getTrackedParam("DIRECTION_RANDOMNESS"),
        getTrackedParam("DIRECTION"),
      ],
    });
    const thickness = createAnimatedValue({
      animationDuration: ANIMATION_SPEED,
      fn: (x) => x,
      deps: [getTrackedParam("THICKNESS")],
      id: "thickness",
    });
    const innerThickness = createAnimatedValue({
      animationDuration: ANIMATION_SPEED,
      fn: (inner, outer) => inner * outer,
      deps: [getTrackedParam("INNER_THICKNESS"), getTrackedParam("THICKNESS")],
      id: "innerThickness",
    });
    const colorsAnimated = createAnimatedColors({
      animationDuration: ANIMATION_SPEED,
      deps: [getTrackedParam("COLOR"), getTrackedParam("INVERT_COLORS")],
      colorProvider: (x, inverted) => [
        controls.COLOR.colors[x][inverted ? 1 : 0],
        controls.COLOR.colors[x][inverted ? 0 : 1],
      ],
      p,
    });

    return {
      setup: () => {
        p.background("black");
        p.noFill();

        // p.mouseClicked = () => {
        //   i++;
        // };
      },
      draw: () => {
        return () => {
          const W = resolutionX.getValue();
          const H = getParam("RESOLUTION");
          const { canvasHeight, canvasWidth } = getCanvasSize();

          p.background("black");
          p.scale(canvasWidth / (W + 1), canvasHeight / (H + 1));
          p.translate(1, 1);

          // drawGrid(p, W, H);

          p.strokeJoin(
            ["miter", "round", "bevel"][
              getParam("CORNERS_TYPE")
            ] as STROKE_JOIN,
          );

          const animationType = getParam("ANIMATION_TYPE");
          const thicknessValue = thickness.getValue();
          const innerThicknessValue = innerThickness.getValue();
          // const wormsArr = worms.getValue().slice(0, 2);
          const wormsArr = worms.getValue();
          const [colorA, colorB] = colorsAnimated.getValue();
          const time = getTime();
          const [start, end] =
            animationType === 1
              ? [-1, 0]
              : animationType === 2
                ? [0, 1]
                : animationType === 3
                  ? [-1, 1]
                  : [0, 0];

          const sin = (x: number) => {
            if (animationType === 3) {
              // should have twice bigger period to match forward animation's "visual" speed,
              // that's why `x/2` and `SHRINK_OFFSET/2`
              return flatSin(p, 0, SHRINK_OFFSET / 2, 0)(x / 2);
            } else {
              return flatSin(p, GROW_OFFSET, 0, SHRINK_OFFSET)(x);
            }
          };

          const animationProgress = oscillateBetween({
            p,
            start,
            end,
            timeMultiplier: 0.01,
            time,
            timeFunc: (x) => (animationType === 2 ? -1 : 1) * sin(x),
          });
          const progress = animationType === 0 ? 0 : animationProgress;
          const longestWormLength = Math.max(
            ...wormsArr.map((x) => x.body.length),
          );

          wormsArr.forEach((worm) => {
            const endColorAmt = worm.body.length / longestWormLength;
            const colorAmt = endColorAmt * (1 - p.abs(progress));

            // outer stroke
            p.stroke(p.lerpColor(colorA, colorB, colorAmt));
            p.strokeWeight(thicknessValue);
            drawWorm(p, progress, worm);

            // inner stroke
            if (innerThicknessValue > 0) {
              p.stroke("black");
              p.strokeWeight(innerThicknessValue);
              drawWorm(p, progress, worm);
            }
          });
        };
      },
    };
  },
);

function drawWorm(p: p5, progress: number, worm: Pick<Worm, "body">): void {
  p.beginShape();
  {
    const body = progress >= 0 ? worm.body : [...worm.body].reverse();
    const head = body[0];
    const absProgress = 1 - p.abs(progress);

    p.vertex(head.x, head.y);

    body.forEach((curr, i) => {
      const localProgress =
        i === 0 ? 1 : getLocalProgress(absProgress, body.length - 1, i - 1);

      if (localProgress === 0) {
        return;
      }

      const prev = i === 0 ? body[0] : body[i - 1];
      const int = p5.Vector.lerp(prev, curr, localProgress);

      p.vertex(int.x, int.y);
      // p.circle(int.x, int.y, 0.01);
    });
  }
  p.endShape();
}

function drawGrid(p: p5, resX: number, resY: number) {
  p.push();
  {
    p.stroke("white");
    p.strokeWeight(0.01);
    for (let x = 0; x < resX; x++) {
      p.line(x, 0, x, resY - 1);
    }
    for (let y = 0; y < resY; y++) {
      p.line(0, y, resX - 1, y);
    }
    p.strokeWeight(0.1);
    p.circle((resX - 1) / 2, (resY - 1) / 2, 0.5);
  }
  p.pop();
}
