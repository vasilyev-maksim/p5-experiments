import { createSketch } from "@/core/createSketch";
import { oscillateBetween, flatSin } from "@/core/utils";
import type { ISketchFactory } from "@/models";
import { BoolMatrix } from "../../utils/BoolMatrix";
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
      fn: (resY, resX, len, dirIsRandom, [r, d], patternType) => {
        // const left = 1 - r,
        //   right = r,
        //   up = 1 - d,
        //   down = d;
        const randomProvider = () => p.random();
        const height = resY;
        const matrix = new BoolMatrix(new Size(resX, height), () => p.random());

        if (len === 0) {
          return Array.from({ length: resY * resX }, (_, i) => {
            const pos = p.createVector((i % resX) + 1, p.floor(i / resX) + 1);
            return new Worm({
              head: pos,
              availablePositionsDict: matrix,
              headDir: "up",
              length: 10,
            });
          });
        }

        const { pattern } = patterns[patternType];
        const patternArgs: PatternArgs = {
          p,
          matrix,
          resY,
          len,
          randomProvider,
        };
        return pattern(patternArgs);
      },
      deps: [
        getTrackedParam("RESOLUTION"),
        resolutionX.getTrackedValue(),
        getTrackedParam("LENGTH"),
        getTrackedParam("DIRECTION_RANDOMNESS"),
        getTrackedParam("DIRECTION"),
        getTrackedParam("PATTERN_TYPE"),
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
          p.background("black");

          const W = resolutionX.getValue();
          const H = getParam("RESOLUTION");
          const animationType = getParam("ANIMATION_TYPE");
          const thicknessValue = thickness.getValue();
          const innerThicknessValue = innerThickness.getValue();
          // const wormsArr = worms.getValue().slice(0, 2);
          const wormsArr = worms.getValue();
          // const MAX_WORM_LENGTH = getProp("WORM_LENGTH");
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
              // should have twice bigger period to match forward animation "visual" speed,
              // that's why `x/2` and `SHRINK_OFFSET/2`
              return flatSin(p, 0, SHRINK_OFFSET / 2, 0)(x / 2);
            } else {
              return flatSin(p, GROW_OFFSET, 0, SHRINK_OFFSET)(x);
            }
          };
          const { canvasHeight, canvasWidth } = getCanvasSize();

          const animationProgress = oscillateBetween({
            p,
            start,
            end,
            timeMultiplier: 0.01,
            time,
            timeFunc: (x) => (animationType === 2 ? -1 : 1) * sin(x),
          });
          const progress = animationType === 0 ? 0 : animationProgress;

          p.scale(canvasWidth / (W + 1), canvasHeight / (H + 1));

          p.strokeJoin(
            ["miter", "round", "bevel"][
              getParam("CORNERS_TYPE")
            ] as STROKE_JOIN,
          );

          const longestWormLength = Math.max(
            ...wormsArr.map((x) => x.body.length),
          );
          wormsArr.forEach((worm) => {
            const endColorAmt = worm.tail.length / longestWormLength;
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

function drawWorm(p: p5, progress: number, worm: Worm): void {
  p.beginShape();
  {
    const body = progress >= 0 ? worm.body : [...worm.body].reverse();
    const absProgress = 1 - p.abs(progress);

    p.vertex(body[0].x, body[0].y);

    body.forEach((curr, i, arr) => {
      const localProgress =
        i === 0
          ? 1
          : getLocalProgress(absProgress, worm.body.length - 1, i - 1);

      if (localProgress === 0) {
        return;
      }

      const prev = i === 0 ? arr[0] : arr[i - 1];
      const int = p5.Vector.lerp(prev, curr, localProgress);

      p.vertex(int.x, int.y);
    });
  }
  p.endShape();
}
