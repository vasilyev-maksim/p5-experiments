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
const FLAT_SIN_OFFSET = 0.2;

export const factory: ISketchFactory<Controls> = createSketch<Controls>(
  ({
    p,
    createMemo,
    getTrackedProp,
    getProp,
    createAnimatedValue,
    createAnimatedColors,
    getTime,
  }) => {
    const resolutionX = createMemo(
      (w, h, r) => p.floor((w * r) / h),
      [
        getTrackedProp("canvasWidth"),
        getTrackedProp("canvasHeight"),
        getTrackedProp("RESOLUTION"),
      ],
    );
    const worms = createMemo(
      (resY, resX, len, dirIsRandom, [r, d]) => {
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
      [
        getTrackedProp("RESOLUTION"),
        resolutionX,
        getTrackedProp("LENGTH"),
        getTrackedProp("DIRECTION_RANDOMNESS"),
        getTrackedProp("DIRECTION"),
      ],
    );
    const thickness = createAnimatedValue(ANIMATION_SPEED, (t) => t, [
      getTrackedProp("THICKNESS"),
    ]);
    const innerThickness = createAnimatedValue(
      ANIMATION_SPEED,
      (inner, outer) => inner * outer,
      [getTrackedProp("INNER_THICKNESS"), getTrackedProp("THICKNESS")],
    );
    const colorsAnimated = createAnimatedColors(
      ANIMATION_SPEED,
      [getTrackedProp("COLOR"), getTrackedProp("INVERT_COLORS")],
      (x, inverted) => [
        controls.COLOR.colors[x][inverted ? 1 : 0],
        controls.COLOR.colors[x][inverted ? 0 : 1],
      ],
      p,
    );

    return {
      setup: () => {
        p.background("black");
        p.noFill();
      },
      draw: () => {
        return () => {
          p.background("black");

          const W = resolutionX.value;
          const H = getProp("RESOLUTION");
          // const MAX_WORM_LENGTH = getProp("WORM_LENGTH");
          const [colorA, colorB] = colorsAnimated.value!;
          const time = getTime();
          const animationType = getProp("ANIMATION_TYPE");
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
              return flatSin(p, 0, FLAT_SIN_OFFSET, 0)(x / 2 - 0.5);
            } else {
              return flatSin(p, 0, 0, FLAT_SIN_OFFSET)(x);
            }
          };

          const animationProgress = oscillateBetween({
            p,
            start,
            end,
            timeMultiplier: 0.02,
            time,
            timeFunc: (x) => -sin(x),
          });
          const progress = animationType === 0 ? 0 : animationProgress;

          p.scale(
            getProp("canvasWidth") / (W + 1),
            getProp("canvasHeight") / (H + 1),
          );

          p.strokeJoin(
            ["miter", "round", "bevel"][getProp("CORNERS_TYPE")] as STROKE_JOIN,
          );

          const longestWormLength = Math.max(
            ...worms.value.map((x) => x.body.length),
          );
          worms.value.forEach((worm) => {
            const endColorAmt = worm.tail.length / longestWormLength;
            const colorAmt = endColorAmt * (1 - p.abs(progress));

            // outer stroke
            p.stroke(p.lerpColor(colorA, colorB, colorAmt));
            p.strokeWeight(thickness.value!);
            worm.draw(p, progress);

            // inner stroke
            if (innerThickness.value! > 0) {
              p.stroke("black");
              p.strokeWeight(innerThickness.value!);
              worm.draw(p, progress);
            }
          });
        };
      },
    };
  },
);
