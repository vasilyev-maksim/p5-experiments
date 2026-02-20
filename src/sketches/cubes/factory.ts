import { createSketch } from "@/core/createSketch";
import { range } from "@/utils/misc";
import type { Controls } from "./controls";
import { drawGrid } from "../utils";

const ANIMATION_SPEED = 20;
const cameraRotationDelta = 0.005;

export const factory = createSketch<Controls>(
  ({
    p,
    getProp,
    getTrackedProp,
    getTime,
    createAnimatedValue,
    createAnimatedArray,
  }) => {
    const animatedCubeSize = createAnimatedValue({
      animationDuration: ANIMATION_SPEED,
      fn: (x) => x,
      deps: [getTrackedProp("CUBE_SIZE")],
    });
    const animatedGap = createAnimatedValue({
      animationDuration: ANIMATION_SPEED,
      fn: (x) => x,
      deps: [getTrackedProp("GAP")],
    });
    const animatedZoom = createAnimatedValue({
      animationDuration: ANIMATION_SPEED,
      fn: (x) => x,
      deps: [getTrackedProp("ZOOM")],
    });
    const animatedSizes = createAnimatedArray({
      animationDuration: ANIMATION_SPEED,
      fn: (x) => range(x).map(() => 1),
      deps: [getTrackedProp("RESOLUTION")],
      initialValueForItem: 0,
    });

    return {
      draw: () => () => {
        p.background("black");
        p.stroke("white");
        p.strokeWeight(0.5);

        const time = getTime();
        const cameraDistance = animatedZoom.getValue();
        const cameraRotationEnabled = getProp("CAMERA_ROTATION");
        const cameraX = cameraRotationEnabled
          ? p.cos(time * cameraRotationDelta) * cameraDistance
          : cameraDistance;
        const cameraY = cameraDistance;
        const cameraZ = cameraRotationEnabled
          ? p.sin(time * cameraRotationDelta) * cameraDistance
          : cameraDistance;

        p.camera(cameraX, cameraDistance, cameraZ, 0, 0, 0, 0, -1, 0);
        p.ambientLight(15, 15, 15);
        p.pointLight(26, 255, 240, cameraX, cameraY, cameraZ);
        // secondary light at coords origin
        p.pointLight(160, 92, 255, 0, 0, 0);

        const cubeSize = animatedCubeSize.getValue();
        const animatedSizesArr = animatedSizes.getValue();
        const resolution = animatedSizesArr.length;
        const totalLen = resolution * 2 + 1;
        const totalSize = totalLen * cubeSize;
        const middleIndex = Math.floor(totalLen / 2);
        const animatedGapValue = animatedGap.getValue();

        drawGrid(p, {
          size: p.createVector(totalSize, totalSize, totalSize),
          cells: p.createVector(totalLen, totalLen, totalLen),
          drawCb: ({ x, y, z }) => {
            let size = 1;
            if (
              !(x === middleIndex && y === middleIndex && z === middleIndex)
            ) {
              const xi =
                x < middleIndex ? resolution - x - 1 : x - (middleIndex + 1);
              const yi =
                y < middleIndex ? resolution - y - 1 : y - (middleIndex + 1);
              const zi =
                z < middleIndex ? resolution - z - 1 : z - (middleIndex + 1);

              const sizeX = x === middleIndex ? 1 : animatedSizesArr[xi];
              const sizeY = y === middleIndex ? 1 : animatedSizesArr[yi];
              const sizeZ = z === middleIndex ? 1 : animatedSizesArr[zi];

              size = Math.min(sizeX, sizeY, sizeZ);
            }

            const boxRelativeSize = size / (1 + animatedGapValue);
            p.box(boxRelativeSize, boxRelativeSize, boxRelativeSize);
          },
        });
      },
    };
  },
  { in3D: true },
);
