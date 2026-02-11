import { createSketch } from "@/core/createSketch";
import { oscillateBetween } from "@/core/utils";
import type { ISketchFactory } from "@/models";
import { Matrix } from "../tiles/Matrix";
import { Size } from "../tiles/Size";
import { type Params, controls } from "./controls";
import { Worm } from "./Worm";
import p5, { type STROKE_JOIN } from "p5";

const ANIMATION_SPEED = 25;

export const factory: ISketchFactory<Params> = createSketch<Params>(
  ({
    p,
    createMemo,
    getTrackedProp,
    getProp,
    createAnimatedValue,
    createAnimatedColors,
    getTime,
  }) => {
    const width = createMemo(
      (w, h, r) => p.floor((w * r) / h),
      [
        getTrackedProp("canvasWidth"),
        getTrackedProp("canvasHeight"),
        getTrackedProp("RESOLUTION"),
      ],
    );
    const worms = createMemo(
      (res, len, width) => {
        if (len === 0) {
          return Array.from({ length: res * width }, (_, i) => {
            const pos = p.createVector((i % width) + 1, p.floor(i / width) + 1);
            return new Worm(pos, 1, () => 1);
          });
        }

        const height = res;
        const matrix = new Matrix(new Size(width, height), () => p.random());
        const arr: Worm[] = [];

        let worm: Worm, head: p5.Vector;

        while (true) {
          head = matrix.getRandomTrue();

          if (!head) {
            break;
          }

          matrix.set(head, false);
          worm = new Worm(head, len, (pos) =>
            matrix.get(pos) ? p.random() : 0,
          );

          while (worm.step((pos) => matrix.set(pos, false))) {
            // noop
          }

          arr.push(worm);
        }

        return arr;
      },
      [getTrackedProp("RESOLUTION"), getTrackedProp("WORM_LENGTH"), width],
    );
    const thickness = createAnimatedValue(ANIMATION_SPEED, (t) => t, [
      getTrackedProp("THICKNESS"),
    ]);
    const colorsAnimated = createAnimatedColors(
      ANIMATION_SPEED,
      [getTrackedProp("COLOR"), getTrackedProp("INVERT_COLORS")],
      (x, inverted) => [
        controls.COLOR.colors[x][inverted ? 1 : 0],
        controls.COLOR.colors[x][inverted ? 0 : 1],
      ],
      p,
    );

    // alert(W);
    return {
      setup: () => {
        p.background("black");
      },
      draw: () => {
        return () => {
          p.background("black");
          p.stroke("white");
          p.stroke("red");
          p.noFill();

          // const N = getProp("N");
          // console.log("N = ", N);
          // console.log("NA = ", NA.value);
          const W = width.value;
          const H = getProp("RESOLUTION");
          const L = getProp("WORM_LENGTH");
          const [colorA, colorB] = colorsAnimated.value!;
          const time = getTime();
          const animF = oscillateBetween(p, 0, 1, 0.02, time);
          // const animF = (time % 200) / 200;
          p.scale(
            getProp("canvasWidth") / (W + 1),
            getProp("canvasHeight") / (H + 1),
          );
          // p.translate(0.25, 0.25);
          p.strokeWeight(thickness.value!);
          p.strokeJoin(
            ["miter", "round", "bevel"][getProp("CORNERS_TYPE")] as STROKE_JOIN,
          );

          worms.value.forEach((worm) => {
            p.stroke(p.lerpColor(colorA, colorB, worm.tail.length / L));

            p.beginShape();
            {
              p.vertex(worm.head.x, worm.head.y);
              p.vertex(worm.head.x, worm.head.y);

              const curr =
                (getProp("ANIMATED") === 1 ? animF : 1) * worm.tail.length;
              // console.log("curr", curr);
              worm.tail.forEach((pos, i, arr) => {
                if (curr >= i + 1) {
                  p.vertex(pos.x, pos.y);
                } else if (curr < i + 1 && curr > i) {
                  const prev = i === 0 ? worm.head : arr[i - 1];
                  const int = p5.Vector.lerp(prev, pos, curr % 1);
                  p.vertex(int.x, int.y);
                }
              });
            }
            p.endShape();
          });

          // p.stroke("white");
          // p.beginShape();
          // p.vertex(5.6, 5.6);
          // // p.vertex(2.6, 5.6);
          // p.endShape();
          // p.circle(2, 2, 2);
          // p.rect(0, 0, W - 1, H - 1);
        };
      },
    };
  },
);
