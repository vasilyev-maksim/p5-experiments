// import { MemoizedValue } from "../utils/MemoizedValue";
import { range } from "../../utils/misc";
import { createSketch } from "@core/createSketch";
import { type Controls, controls } from "./controls";

const ANIMATION_SPEED = 25;
const POLYGONS_COUNT = 500,
  BG_COLOR = "black";

export const factory = createSketch<Controls>(
  ({
    createAnimatedColors,
    createAnimatedValue,
    createMemo,
    getProp,
    getTime,
    getTrackedProp,
    p,
  }) => {
    const THICKNESS = createMemo(
      (x) => controls.THICKNESS.max + controls.THICKNESS.min - x,
      [getTrackedProp("THICKNESS")],
    );
    const COIL_SPEED = createMemo(
      (x) =>
        x === 0 ? 0 : controls.COIL_SPEED.max + controls.COIL_SPEED.min - x + 1,
      [getTrackedProp("COIL_SPEED")],
    );
    const zoomAnimated = createAnimatedValue(ANIMATION_SPEED, (x) => x, [
      getTrackedProp("ZOOM"),
    ]);
    const fillColorsAnimated = createAnimatedColors(
      ANIMATION_SPEED,
      [getTrackedProp("FILL_COLORS")],
      (x) => controls.FILL_COLORS.colors[x],
      p,
    );
    const borderColorAnimated = createAnimatedColors(
      ANIMATION_SPEED,
      [getTrackedProp("BORDER_COLOR")],
      (x) => controls.BORDER_COLOR.colors[x],
      p,
    );

    return {
      setup: () => {
        p.background(BG_COLOR);
        p.strokeWeight(1);
        p.angleMode("degrees");
      },
      draw: () => {
        function getNodes(): [number, number][] {
          const time = getTime();
          return range(POLYGONS_COUNT).map((i) => {
            const d = (zoomAnimated.value! * p.width) / 1158;
            return [
              i * d,
              i *
                getProp("COIL_FACTOR") *
                (COIL_SPEED.value === 0 ? 1 : p.sin(time / COIL_SPEED.value)) +
                time * getProp("ROTATION_SPEED"),
            ];
          });
        }

        function drawCircle([d, angle]: [number, number]) {
          const x = d * p.cos(angle);
          const y = d * p.sin(angle);
          p.circle(
            p.width / 2 + x,
            p.height / 2 + y,
            (d * 2) / THICKNESS.value,
          );
        }

        function drawPolygon([d, angle]: [number, number]) {
          const x = d * p.cos(angle) + p.width / 2;
          const y = d * p.sin(angle) + p.height / 2;
          const adelta = 360 / getProp("POLYGON_N");

          p.push();
          {
            p.translate(x, y);
            p.beginShape();
            for (let a = 0; a < 360; a += adelta) {
              const sx = (p.cos(a) * d) / THICKNESS.value;
              const sy = (p.sin(a) * d) / THICKNESS.value;
              p.vertex(sx, sy);
            }
            p.endShape("close");
          }
          p.pop();
        }

        return () => {
          p.background(BG_COLOR);

          const nodes = getNodes();
          nodes.forEach((node, i, arr) => {
            const [colorA, colorB] = fillColorsAnimated.value!;
            const fillColor = p.lerpColor(
              p.color(colorA),
              p.color(colorB),
              p.sin(
                getTime() * getProp("COLOR_CHANGE_SPEED") +
                  (i / arr.length) * 360 * 4,
              ),
            );

            p.fill(fillColor);
            p.stroke(borderColorAnimated.value[0]);

            if (getProp("POLYGON_N") === controls.POLYGON_N.max) {
              drawCircle(node);
            } else {
              drawPolygon(node);
            }
          });
        };
      },
    } as const;
  },
);
