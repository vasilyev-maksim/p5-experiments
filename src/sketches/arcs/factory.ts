import {
  SquareBorderPointsJoiner,
  type JointRenderCallback,
} from "@/core/BorderPointsJoiner";
import { createSketch } from "@/core/createSketch";
import { oscillateBetween } from "@/core/utils";
import p5 from "p5";
import { controls, type Controls } from "./controls";

const ANIMATION_SPEED = 20;

export const factory = createSketch<Controls>(
  ({
    getTime,
    getProp,
    createAnimatedValue,
    getTrackedProp,
    p,
    createAnimatedColors,
  }) => {
    const paddingPercentAnimated = createAnimatedValue(
      ANIMATION_SPEED,
      (x) => x,
      [getTrackedProp("PADDING_PERCENT")],
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
        p.angleMode("radians");
      },
      draw: () => {
        function drawArc({
          a,
          b,
          curvature,
          colorIntensity,
          colorA,
          colorB,
        }: {
          p: p5;
          a: p5.Vector;
          b: p5.Vector;
          curvature: number;
          colorIntensity: number;
          colorA: p5.Color;
          colorB: p5.Color;
        }) {
          p.push();
          {
            const ab = p5.Vector.sub(b, a);
            const am = ab.mult(0.5);
            const amMag = am.mag();
            const m = p5.Vector.lerp(b, a, 0.5);
            const angle = am.heading();
            const curAbs = p.abs(curvature);
            const curSign = Math.sign(curvature);

            p.noFill();
            p.stroke(p.lerpColor(colorA, colorB, colorIntensity));
            p.translate(m.x, m.y);
            p.rotate(angle);
            p.strokeWeight((2 * p.width) / 1158);
            p.arc(
              0,
              0,
              amMag * 2,
              curAbs,
              curSign > 0 ? 0 : p.PI,
              curSign > 0 ? p.PI : p.TWO_PI,
            );
          }
          p.pop();
        }

        return () => {
          p.background("black");
          const PADDING_PERCENT = paddingPercentAnimated.value!,
            RESOLUTION = getProp("RESOLUTION"),
            CURVATURE_TYPE = getProp("CURVATURE_TYPE"),
            MAX_NEGATIVE_CURVATURE = getProp("MAX_NEGATIVE_CURVATURE"),
            MAX_CURVATURE = getProp("MAX_CURVATURE"),
            [colorA, colorB] = colorsAnimated.value!,
            PATTERN_TYPE = getProp("PATTERN_TYPE"),
            time = getTime();

          const SIZE = Math.min(p.width, p.height),
            ACTUAL_SIZE = SIZE * (1 - PADDING_PERCENT / 100),
            x0 = (p.width - ACTUAL_SIZE) / 2,
            y0 = (p.height - ACTUAL_SIZE) / 2;

          const r = RESOLUTION,
            r2 = r * 2,
            r3 = r * 3,
            r4 = r * 4;

          const joiner = new SquareBorderPointsJoiner(
            p.createVector(x0, y0),
            p.createVector(x0 + ACTUAL_SIZE, y0 + ACTUAL_SIZE),
            r,
            r,
          );

          const render =
            (curvatureSign: 1 | -1) =>
            (a: p5.Vector, b: p5.Vector, i: number, n: number) => {
              if (a.equals(b) || !a || !b) return;

              const halfDiagonal = (ACTUAL_SIZE * 2) / p.sqrt(2);
              const curvatureFactor =
                CURVATURE_TYPE === 0
                  ? i / n
                  : CURVATURE_TYPE === 1
                    ? 1 - i / n
                    : 1;
              const distanceToDiagonal =
                curvatureFactor * halfDiagonal * curvatureSign || 1;
              const curvature = oscillateBetween({
                p,
                start: distanceToDiagonal * MAX_NEGATIVE_CURVATURE * -1,
                end: distanceToDiagonal * MAX_CURVATURE,
                speed: 0.02,
                time,
              });
              const colorIntensity = p.map(
                p.abs(curvature),
                0,
                halfDiagonal,
                1,
                0,
              );

              drawArc({
                p,
                a,
                b,
                curvature,
                colorIntensity,
                colorA,
                colorB,
              });
            };

          let intervals: [
            [number, number],
            [number, number],
            JointRenderCallback,
          ][];
          if (PATTERN_TYPE === 0) {
            intervals = [
              [[0, r], [r2, r], render(1)],
              [[r4, r3], [r2, r3], render(-1)],
            ];
          } else if (PATTERN_TYPE === 1) {
            intervals = [
              [[0, r2], [r2, 0], render(1)],
              [[r2, r4], [r4, r2], render(1)],
            ];
          } else if (PATTERN_TYPE === 2) {
            intervals = [
              [[0, r], [r, r2], render(1)],
              [[r3, r4], [r2, r3], render(-1)],
              [[r, r2], [r2, r3], render(1)],
              [[0, r], [r3, r4], render(-1)],
            ];
          } else if (PATTERN_TYPE === 3) {
            intervals = [
              [[0, r / 2], [r2 + (r * 3) / 4, r2 + r / 4], render(1)],
              [[r, r / 2], [r2 + r / 4, r2 + (r * 3) / 4], render(-1)],
              [[r3, r2 + r / 2], [r / 4, r - r / 4], render(-1)],
              [[r2, r2 + r / 2], [r - r / 4, r / 4], render(1)],
            ];
          } else {
            intervals = [
              [[0, r / 2], [r, r - r / 2], render(1)],
              [[r, r / 2], [r, r + r / 2], render(1)],
              [[r, r + r / 2], [r2, r2 - r / 2], render(1)],
              [[r2, r + r / 2], [r2, r2 + r / 2], render(1)],
              [[r2, r2 + r / 2], [r3, r3 - r / 2], render(1)],
              [[r3, r2 + r / 2], [r3, r3 + r / 2], render(1)],
              [[r3, r3 + r / 2], [0, -r / 2], render(1)],
              [[r4, r3 + r / 2], [r4, r4 + r / 2], render(1)],
            ];
          }

          intervals.forEach(([starts, ends, cb]) => {
            joiner.renderJoints(starts, ends, cb);
          });
        };
      },
    };
  },
);
