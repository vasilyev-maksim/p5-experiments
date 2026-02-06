import { createSketch } from "@/core/createSketch";
import type { ISketchFactory } from "@/models";
import type { Params } from ".";
import { drawBuilding } from "./utils/building";

export const factory: ISketchFactory<Params> = createSketch<Params>(
  ({ p, createAnimatedValue, getTrackedProp }) => {
    const animatedNInt = createAnimatedValue(25, (x) => x, [
      getTrackedProp("NInt"),
    ]);

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
      draw: () => {
        return () => {
          p.stroke("white");
          p.background("black");
          p.noStroke();
          p.lights();

          p.orbitControl();
          p.debugMode(500, 10, 0, 0, 0, -100, 0, 0, 0);

          p.scale(50);
          const homeSize = p.createVector(animatedNInt.value!, 3, 7);
          drawBuilding(p, { size: homeSize });
        };
      },
      in3D: true,
    };
  },
);
