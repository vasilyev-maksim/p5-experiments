import { createSketch } from "@/core/createSketch";
import { drawBuilding } from "./utils/building";
import type { Controls } from "./controls";

export const factory = createSketch<Controls>(
  ({ p, createAnimatedValue, getTrackedProp }) => {
    const animatedNInt = createAnimatedValue({
      animationDuration: 25,
      fn: (x) => x,
      deps: [getTrackedProp("NInt")],
    });

    return {
      setup: () => {
        p.background("black");
        p.camera(250, -150, 450, 0, 0, 0);
        // p.noStroke();
        // shape = p.loadModel("/tinker.obj", {
        //   normalize: true,
        //   successCallback: () => console.log("success"),
        //   failureCallback: () => console.log("fail"),
        // });
      },
      draw: () => () => {
        p.stroke("white");
        p.background("black");
        p.noStroke();
        p.lights();

        p.orbitControl();
        p.debugMode(500, 10, 0, 0, 0, -100, 0, 0, 0);

        p.scale(50);
        const homeSize = p.createVector(animatedNInt.getValue(), 3, 7);
        drawBuilding(p, { size: homeSize });
      },
    };
  },
  { in3D: true },
);
