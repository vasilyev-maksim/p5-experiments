import { createSketch } from "@/core/createSketch";
import { oscillateBetween, flatSin } from "@/core/utils";
import type { ISketchFactory } from "@/models";
import { Matrix } from "../tiles/Matrix";
import { Size } from "../tiles/Size";
import { controls, type Controls } from "./controls";
import { Worm } from "./Worm";
import p5, { type STROKE_JOIN } from "p5";
import { mapDirection } from "../utils";

const ANIMATION_SPEED = 25;
const SHRINK_OFFSET = 0.3;
const GROW_OFFSET = 0.1;

export const factory: ISketchFactory<Controls> = createSketch<Controls>(
  ({
    p,
    createMemo,
    getTrackedProp,
    getProp,
    createAnimatedValue,
    createAnimatedColors,
    getTime,
    getCanvasSize,
  }) => {
    const { trackedCanvasHeight, trackedCanvasWidth } = getCanvasSize();
    const resolutionX = createMemo({
      fn: (w, h, r) => p.floor((w * r) / h),
      deps: [
        trackedCanvasWidth,
        trackedCanvasHeight,
        getTrackedProp("RESOLUTION"),
      ],
    });
    const worms = createMemo({
      fn: (resY, resX, len, dirIsRandom, [r, d]) => {
        console.log("WORM", {
          resY,
          resX,
          len,
          dirIsRandom,
          d: [r, d],
        });

        const left = 1 - r,
          right = r,
          up = 1 - d,
          down = d;
        if (len === 0) {
          return Array.from({ length: resY * resX }, (_, i) => {
            const pos = p.createVector((i % resX) + 1, p.floor(i / resX) + 1);
            return new Worm(
              pos,
              1,
              () => 1,
              () => {},
            );
          });
        }

        const height = resY;
        const matrix = new Matrix(new Size(resX, height), () => p.random());
        const arr: Worm[] = [];

        while (true) {
          const head = matrix.getRandomTrue();

          if (!head) {
            break;
          }

          arr.push(
            new Worm(
              head,
              len,
              (pos, worm) => {
                const dir = p5.Vector.sub(worm.head, pos);
                const weight = mapDirection(dir, {
                  right: right * (dirIsRandom ? p.random() : 1),
                  left: left * (dirIsRandom ? p.random() : 1),
                  up: up * (dirIsRandom ? p.random() : 1),
                  down: down * (dirIsRandom ? p.random() : 1),
                });
                return matrix.get(pos) ? weight : 0;
              },
              (pos) => matrix.set(pos, false),
            ).grow(),
          );
        }

        return arr;
      },
      deps: [
        getTrackedProp("RESOLUTION"),
        resolutionX.getTrackedValue(),
        getTrackedProp("LENGTH"),
        getTrackedProp("DIRECTION_RANDOMNESS"),
        getTrackedProp("DIRECTION"),
      ],
    });
    const thickness = createAnimatedValue({
      animationDuration: ANIMATION_SPEED,
      fn: (x) => x,
      deps: [getTrackedProp("THICKNESS")],
      id: "thickness",
    });
    const innerThickness = createAnimatedValue({
      animationDuration: ANIMATION_SPEED,
      fn: (inner, outer) => inner * outer,
      deps: [getTrackedProp("INNER_THICKNESS"), getTrackedProp("THICKNESS")],
      id: "innerThickness",
    });
    const colorsAnimated = createAnimatedColors({
      animationDuration: ANIMATION_SPEED,
      deps: [getTrackedProp("COLOR"), getTrackedProp("INVERT_COLORS")],
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
          const H = getProp("RESOLUTION");
          const animationType = getProp("ANIMATION_TYPE");
          const thicknessValue = thickness.getValue();
          const innerThicknessValue = innerThickness.getValue();
          const wormsArr = worms.getValue();
          // const MAX_WORM_LENGTH = getProp("WORM_LENGTH");
          const [colorA, colorB] = colorsAnimated.getValue();
          const time = getTime();
          const [start, end] =
            animationType === 1
              ? [0, 1]
              : animationType === 2
                ? [-1, 0]
                : animationType === 3
                  ? [-1, 1]
                  : [0, 0];

          const sin = (x: number) => {
            if (animationType === 3) {
              // should have twice bigger period to match forward animation "visual" speed,
              // that's why `x/2` and `SHRINK_OFFSET/2`
              return flatSin(p, 0, SHRINK_OFFSET / 2, 0)(x / 2);
            } else {
              return flatSin(p, GROW_OFFSET / 2, 0, SHRINK_OFFSET)(x);
            }
          };
          const { canvasHeight, canvasWidth } = getCanvasSize();

          const animationProgress = oscillateBetween({
            p,
            start,
            end,
            timeMultiplier: 0.02,
            time,
            timeFunc: (x) => -sin(x),
          });
          const progress = animationType === 0 ? 0 : animationProgress;

          p.scale(canvasWidth / (W + 1), canvasHeight / (H + 1));

          p.strokeJoin(
            ["miter", "round", "bevel"][getProp("CORNERS_TYPE")] as STROKE_JOIN,
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
            worm.draw(p, progress);

            // inner stroke
            if (innerThicknessValue > 0) {
              p.stroke("black");
              p.strokeWeight(innerThicknessValue);
              worm.draw(p, progress);
            }
          });
        };
      },
    };
  },
);
