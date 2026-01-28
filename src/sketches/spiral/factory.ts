// import { MemoizedValue } from "../utils/MemoizedValue";
import { range } from "../../utils/misc";
import { createSketch } from "../utils/createSketch";
import { type Params, controls } from "./controls";

export const factory = createSketch<Params>(({ createMemo, getProp }) => {
  const POLYGONS_COUNT = 500,
    BG_COLOR = "black";

  const THICKNESS = createMemo(
    (x) => controls.THICKNESS.max + controls.THICKNESS.min - x,
    [getProp("THICKNESS", true)],
  );

  const COIL_SPEED = createMemo(
    (x) =>
      x === 0 ? 0 : controls.COIL_SPEED.max + controls.COIL_SPEED.min - x + 1,
    [getProp("COIL_SPEED", true)],
  );

  return {
    setup: ({ p }) => {
      p.background("black");
      p.fill(255, 0, 0, 10);
      p.strokeWeight(1);
      p.angleMode("degrees");
    },
    drawFactory: ({ p, getProp, getTime }) => {
      function getNodes(): [number, number][] {
        const time = getTime();
        return range(POLYGONS_COUNT).map((i) => {
          const d = (getProp("ZOOM") * p.width) / 1158;
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
        // const THICKNESS = getProp("THICKNESS");
        const x = d * p.cos(angle);
        const y = d * p.sin(angle);
        p.circle(p.width / 2 + x, p.height / 2 + y, (d * 2) / THICKNESS.value);
      }

      function drawPolygon([d, angle]: [number, number]) {
        // const THICKNESS = getProp("THICKNESS");
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
          const [colorA, colorB] =
            controls.FILL_COLORS.colors[getProp("FILL_COLORS")];
          const fillColor = p.lerpColor(
            p.color(colorA),
            p.color(colorB),
            p.sin(
              getTime() * getProp("COLOR_CHANGE_SPEED") +
                (i / arr.length) * 360 * 4,
            ),
          );

          p.fill(fillColor);
          p.stroke(controls.BORDER_COLOR.colors[getProp("BORDER_COLOR")][0]);

          if (getProp("POLYGON_N") === controls.POLYGON_N.max) {
            drawCircle(node);
          } else {
            drawPolygon(node);
          }
        });
      };
    },
  } as const;
});
