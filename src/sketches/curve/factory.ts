import { createSketch } from "@/core/createSketch";
import { range } from "@/utils/misc";
import { controls, type Controls } from "./controls";

const JOINT_SIZE = 10;
const ANIMATION_SPEED = 25;
const BG_COLOR = "black";

export const factory = createSketch<Controls>(
  ({
    getProp,
    getTime,
    getTrackedProp,
    p,
    createAnimatedValue,
    createMemo,
  }) => {
    const gapAnimated = createAnimatedValue(
      ANIMATION_SPEED,
      (x, canvasWidth) => (x * canvasWidth) / 1158,
      [getTrackedProp("GAP"), getTrackedProp("canvasWidth")],
    );
    const strokeWidth = createMemo(
      (canvasWidth) => (2 * canvasWidth) / 1158,
      [getTrackedProp("canvasWidth")],
    );

    return {
      onPresetChange: () => {
        p.background(BG_COLOR);
      },
      setup: () => {
        p.background(BG_COLOR);
      },
      draw: () => () => {
        const CHAOS_FACTOR = getProp("CHAOS_FACTOR"),
          CURVE_RESOLUTION = getProp("CURVE_RESOLUTION"),
          DISPERSION = getProp("DISPERSION"),
          time = getTime(),
          TRACE_FACTOR = getProp("TRACE_FACTOR"),
          CURVES_COUNT = getProp("CURVES_COUNT"),
          JOINT_TYPE = getProp("JOINT_TYPE");

        const noiseDelta = p.map(CHAOS_FACTOR, 0, 100, 0.001, 0.05),
          opacity = p.map(TRACE_FACTOR, 0, 100, 100, 5),
          twinMidIndex = Math.round((CURVES_COUNT - 1) / 2),
          color = p.color(controls.COLOR.colors[getProp("COLOR")][0]);

        p.background(p.color(0, 0, 0, opacity));
        p.noFill();
        p.strokeWeight(strokeWidth.value!);

        const yCoords = range(CURVE_RESOLUTION + 2).map((i) =>
          p.map(
            p.noise(i, time * noiseDelta),
            0,
            1,
            (p.height / 2) * (1 - DISPERSION),
            (p.height / 2) * (1 + DISPERSION),
          ),
        );

        for (let t = -twinMidIndex; t <= twinMidIndex; t++) {
          const yOffset = t * gapAnimated.value!;
          const alpha =
            t === 0 ? 255 : p.map(p.abs(t), 0, twinMidIndex + 1, 20, 0);

          color.setAlpha(alpha);
          p.stroke(color);

          p.beginShape();
          yCoords.forEach((_y, i, arr) => {
            const x = (p.width * (i - 1)) / (arr.length - 3);
            const y = _y + yOffset;
            const j = JOINT_SIZE,
              j2 = JOINT_SIZE / 2;
            switch (JOINT_TYPE) {
              case 1:
                p.rect(x - j2, y - j2, j, j);
                break;
              case 2:
                p.circle(x, y, j);
                break;
              case 3:
                p.line(x, y - j2, x, y + j2);
                p.line(x - j2, y, x + j2, y);
                break;
              case 4: {
                p.line(x - j2, y - j2, x + j2, y + j2);
                p.line(x - j2, y + j2, x + j2, y - j2);
                break;
              }
            }
            p.curveVertex(x, y);
          });
          p.endShape();
        }
      },
    };
  },
);
