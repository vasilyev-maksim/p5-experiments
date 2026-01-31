import { createSketch } from "@/core/createSketch";
import { oscillateBetween } from "@/core/utils";
import { range } from "@/utils/misc";
import p5 from "p5";
import { controls, type Params } from "./controls";
import type { ISketchFactory } from "@/models";

const ANIMATION_SPEED = 30;
const COLOR_ANIMATION_SPEED = 60;

export const factory: ISketchFactory<Params> = createSketch<Params>(
  ({
    createAnimatedColors,
    createAnimatedValue,
    createMemo,
    getProp,
    getTime,
    getTrackedProp,
    p,
  }) => {
    const animatedRadius = createAnimatedValue(
        ANIMATION_SPEED,
        (canvasWidth, zoom) => (canvasWidth * zoom) / 120,
        [getTrackedProp("canvasWidth"), getTrackedProp("ZOOM")],
      ),
      gap = createMemo(
        (x) => p.map(x, controls.GAP.min, controls.GAP.max, 0.1, 3),
        [getTrackedProp("GAP")],
      ),
      coilSpeed = createMemo((x) => x, [getTrackedProp("COIL_SPEED")]),
      coilFactor = createMemo(
        (x) =>
          p.map(x, controls.COIL_FACTOR.min, controls.COIL_FACTOR.max, 0, 400),
        [getTrackedProp("COIL_FACTOR")],
      ),
      rotationSpeed = createMemo(
        (x) =>
          p.map(
            x,
            controls.ROTATION_SPEED.min,
            controls.ROTATION_SPEED.max,
            0,
            10,
          ),
        [getTrackedProp("ROTATION_SPEED")],
      ),
      colorsAnimated = createAnimatedColors(
        COLOR_ANIMATION_SPEED,
        [getTrackedProp("COLOR")],
        (x) => controls.COLOR.colors[x],
        p,
      );

    return {
      setup: () => {
        p.noStroke();
        p.angleMode("degrees");
      },
      draw: () => () => {
        const [colorB, colorA] = colorsAnimated.value;
        const canvasWidth = getProp("canvasWidth"),
          canvasHeight = getProp("canvasHeight"),
          resolution = getProp("RESOLUTION"),
          radius = animatedRadius.value!,
          CENTER_VEC = p.createVector(canvasWidth / 2, canvasHeight / 2);
        const time = getTime();
        const baseAngle = (time * rotationSpeed.value!) % 360;

        p.background(colorB);

        range(resolution, true).forEach((i) => {
          const dir = [
            p.createVector(1, 0),
            p.createVector(-1, 0),
            p.createVector(0, 1),
            p.createVector(0, -1),
          ][i % 2];
          const rotationShiftDelta = radius * gap.value! * i;
          const rotationCenter = p5.Vector.add(
            CENTER_VEC,
            p.createVector(
              dir.x * rotationShiftDelta,
              dir.y * rotationShiftDelta,
            ),
          );
          const diameter = radius * 2 * (i + 1);
          const fillColor = p.lerpColor(colorA, colorB, i / resolution);

          const delta =
            -coilFactor.value! *
            (i + 1) *
            oscillateBetween(p, 0, 1, coilSpeed.value!, time); // change last param to 3 for more chaos
          const angle = (baseAngle + delta) * (i % 2 == 1 ? 1 : -1);
          const localX = CENTER_VEC.x - rotationCenter.x;
          const localY = CENTER_VEC.y - rotationCenter.y;

          p.push();
          {
            p.translate(rotationCenter.x, rotationCenter.y);
            p.rotate(angle);
            p.fill(fillColor);
            p.circle(localX, localY, diameter);
          }
          p.pop();
        });
      },
    };
  },
);
