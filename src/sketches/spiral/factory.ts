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
    const THICKNESS = createMemo({
      fn: (x) => controls.THICKNESS.max + controls.THICKNESS.min - x,
      deps: [getTrackedProp("THICKNESS")],
    });
    const COIL_SPEED = createMemo({
      fn: (x) =>
        x === 0 ? 0 : controls.COIL_SPEED.max + controls.COIL_SPEED.min - x + 1,
      deps: [getTrackedProp("COIL_SPEED")],
    });
    const zoomAnimated = createAnimatedValue({
      animationDuration: ANIMATION_SPEED,
      fn: (x) => x,
      deps: [getTrackedProp("ZOOM")],
    });
    const fillColorsAnimated = createAnimatedColors({
      animationDuration: ANIMATION_SPEED,
      deps: [getTrackedProp("FILL_COLORS")],
      colorProvider: (x) => controls.FILL_COLORS.colors[x],
      p,
    });
    const borderColorAnimated = createAnimatedColors({
      animationDuration: ANIMATION_SPEED,
      deps: [getTrackedProp("BORDER_COLOR")],
      colorProvider: (x) => controls.BORDER_COLOR.colors[x],
      p,
    });

    function getNodes(): [number, number][] {
      const time = getTime();
      const d = (zoomAnimated.getValue() * p.width) / 1158;
      const coilSpeed = COIL_SPEED.getValue();

      return range(POLYGONS_COUNT).map((i) => {
        return [
          i * d,
          i *
            getProp("COIL_FACTOR") *
            (coilSpeed === 0 ? 1 : p.sin(time / coilSpeed)) +
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
        (d * 2) / THICKNESS.getValue(),
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
          const sx = (p.cos(a) * d) / THICKNESS.getValue();
          const sy = (p.sin(a) * d) / THICKNESS.getValue();
          p.vertex(sx, sy);
        }
        p.endShape("close");
      }
      p.pop();
    }

    return {
      setup: () => {
        p.background(BG_COLOR);
        p.strokeWeight(1);
        p.angleMode("degrees");
      },
      draw: () => () => {
        p.background(BG_COLOR);
        const [borderColor] = borderColorAnimated.getValue();
        const [colorA, colorB] = fillColorsAnimated.getValue();

        const nodes = getNodes();
        nodes.forEach((node, i, arr) => {
          const fillColor = p.lerpColor(
            colorA,
            colorB,
            p.sin(
              getTime() * getProp("COLOR_CHANGE_SPEED") +
                (i / arr.length) * 360 * 4,
            ),
          );

          p.fill(fillColor);
          p.stroke(borderColor);

          if (getProp("POLYGON_N") === controls.POLYGON_N.max) {
            drawCircle(node);
          } else {
            drawPolygon(node);
          }
        });
      },
    } as const;
  },
);
