import type { IControls, IPreset, ISketch } from "../../models";
import { createSketch } from "@core/createSketch";
import { drawGrid } from "../city/utils/grid";

export type Controls = typeof controls;

const controls = {
  X: {
    type: "range",
    min: 0,
    max: 10,
    step: 0.1,
    label: "X",
  },
  Y: {
    type: "range",
    min: 0,
    max: 10,
    step: 0.1,
    label: "Y",
  },
  Z: {
    type: "range",
    min: 0,
    max: 10,
    step: 0.1,
    label: "Z",
  },
  A: {
    type: "range",
    min: 1,
    max: 20,
    step: 1,
    label: "A",
  },
  B: {
    type: "range",
    min: 1,
    max: 200,
    step: 1,
    label: "B",
  },
} as const satisfies IControls;

export const factory = createSketch<Controls>(
  ({ p, getTrackedProp, createMemo }) => {
    // const AX = createAnimatedValue(25, (x) => x, [getTrackedProp("X")]);
    const X = createMemo((x) => x, [getTrackedProp("X")]);
    const Y = createMemo((x) => x, [getTrackedProp("Y")]);
    const Z = createMemo((x) => x, [getTrackedProp("Z")]);
    // const A = createMemo((x) => x, [getTrackedProp("A")]);
    // const B = createMemo((x) => x, [getTrackedProp("B")]);

    return {
      setup: () => {
        p.background("black");
        p.camera(400, -400, 400, 0, 0, 0);
      },
      draw: () => {
        return () => {
          p.background("black");
          p.stroke("white");

          console.log(
            "X =",
            X.value,
            "\t",
            "Y =",
            Y.value,
            "\t",
            "Z =",
            Z.value,
          );

          p.debugMode(500, 10, 0, 0, 0, -100, 0, 0, 0);
          p.orbitControl();
          const lightPosition = p.createVector(
            X.value! * 100,
            Y.value! * -100,
            Z.value! * -100,
          );
          // p.spotLight(
          //   255,
          //   255,
          //   255,
          //   lightPosition,
          //   -1,
          //   0,
          //   -1,
          //   p.PI / A.value!,
          //   B.value!,
          // );
          // p.specularColor("yellow");
          p.ambientLight(0, 0, 125);
          p.directionalLight(255, 255, 255, -1, 0, -1);
          p.push();
          {
            p.translate(lightPosition);
            p.box(10);
          }
          p.pop();

          // p.perspective(p.PI / 9);

          p.fill("red");
          p.ambientMaterial(255, 0, 255);
          // p.ambientMaterial(255, 255, 255);
          p.specularMaterial(0, 255, 0);
          p.shininess(50);
          // p.emissiveMaterial("red");

          p.noStroke();
          p.scale(50);
          p.translate(0, -2.5, 0);
          // p.box(5, 5, 5);
          drawGrid(p, {
            size: p.createVector(5, 5, 5),
            cells: p.createVector(3, 3, 3),
            drawCb: () => p.torus(0.3, 0.1),
          });
        };
      },
      in3D: true,
    };
  },
);

const presets: IPreset<Controls>[] = [
  {
    params: {
      X: 3,
      Y: 1.2,
      Z: -3,
      A: 10,
      B: 10,
    },
  },
];

export const sketch: ISketch<Controls> = {
  factory,
  id: "lights",
  name: "lights",
  preview: {
    size: 520,
  },
  randomSeed: 44,
  controls,
  presets,
  type: "hidden",
};
