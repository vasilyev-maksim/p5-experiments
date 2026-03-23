import { createSketch } from "@/core/createSketch";
import { oscillateBetween, flatSin } from "@/core/utils";
import type { ISketchFactory } from "@/models";
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
      fn: (resY, resX, len, patternType, seed) => {
        p.randomSeed(seed);
        const randomProvider = () => p.random();

        if (len === 0) {
          return Array.from({ length: resY * resX }, (_, i) => {
            const pos = p.createVector(i % resX, p.floor(i / resX));
            return new Worm({
              head: pos,
            });
          });
        }

        const pattern = patterns[patternType];
        const patternArgs: PatternArgs = {
          p,
          resY,
          resX,
          len,
          randomProvider,
        };
        const worms = pattern(patternArgs);

        return worms;
      },
      deps: [
        getTrackedParam("RESOLUTION"),
        resolutionX.getTrackedValue(),
        getTrackedParam("LENGTH"),
        getTrackedParam("PATTERN_TYPE"),
        getTrackedParam("RANDOM_SEED"),
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
      },
      draw: () => {
        return () => {
          const W = resolutionX.getValue();
          const H = getParam("RESOLUTION");
          const { canvasHeight, canvasWidth } = getCanvasSize();

          p.background("black");
          p.scale(canvasWidth / (W + 1), canvasHeight / (H + 1));
          p.translate(1, 1);

          p.strokeJoin(
            ["miter", "round", "bevel"][
              getParam("CORNERS_TYPE")
            ] as STROKE_JOIN,
          );

          const animationType = getParam("ANIMATION_TYPE");
          const thicknessValue = thickness.getValue();
          const innerThicknessValue = innerThickness.getValue();
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
              return flatSin(
                p,
                GROW_OFFSET / 2,
                SHRINK_OFFSET / 2,
                GROW_OFFSET / 2,
              )(x / 2);
            } else {
              return flatSin(p, GROW_OFFSET, 0, SHRINK_OFFSET)(x);
            }
          };

          const animationProgress = oscillateBetween({
            p,
            start,
            end,
            timeMultiplier: 0.005,
            time,
            timeFunc: (x) => (animationType === 2 ? -1 : 1) * sin(x),
          });
          const progress = animationType === 0 ? 0 : animationProgress;
          const longestWormLength = Math.max(...wormsArr.map((x) => x.length));

          wormsArr.forEach((worm) => {
            const endColorAmt = worm.length / longestWormLength;
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
    });
  }
  p.endShape();
}
