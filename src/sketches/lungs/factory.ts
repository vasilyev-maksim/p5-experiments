import { createSketch } from "@/core/createSketch";
import { oscillateBetween } from "@/core/utils";
import { range } from "@/utils/misc";
import p5 from "p5";
import { Circle } from "./Circle";
import type { Params } from "./controls";
import type { ISketchFactory } from "@/models";

const RINGS_COUNT = 20;

export const factory: ISketchFactory<Params> = createSketch<Params>(
  ({ createMemo, getTime, getTrackedProp, p }) => {
    const CIRCLES = createMemo(
      (canvasWidth: number, canvasHeight: number) => {
        const RD = canvasWidth / 120,
          CENTER_VEC = p.createVector(canvasWidth / 2, canvasHeight / 2);

        return range(RINGS_COUNT, true).map((i) => {
          const dir = [
            p.createVector(1, 0),
            p.createVector(-1, 0),
            p.createVector(0, 1),
            p.createVector(0, -1),
          ][i % 2];
          const rotationShiftDelta = (RD / 2) * (i + 1);

          return new Circle(
            CENTER_VEC,
            RD * (i + 1),
            p.lerpColor(
              p.color("#ea72f7ff"),
              p.color("#530984ff"),
              i / RINGS_COUNT,
            ),
            p5.Vector.add(
              CENTER_VEC,
              p.createVector(
                dir.x * rotationShiftDelta,
                dir.y * rotationShiftDelta,
              ),
            ),
          );
        });
      },
      [getTrackedProp("canvasWidth"), getTrackedProp("canvasHeight")],
    );

    return {
      setup: () => {
        p.noStroke();
        p.angleMode("degrees");
      },
      draw: () => () => {
        p.background("#530984ff");

        const time = getTime();
        const angle = (time * 2) % 360;

        CIRCLES.value!.forEach((r, i) => {
          const delta = 9 * (i + 1) * oscillateBetween(p, 0, 1, 3, time); // change last param to 3 for more chaos
          const ang = (angle + delta) * (i % 2 == 0 ? 1 : -1);
          r.render(p, ang);
        });
      },
    };
  },
);
