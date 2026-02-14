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
    const animatedCubeSize = createAnimatedValue(ANIMATION_SPEED, (x) => x, [
      getTrackedProp("CUBE_SIZE"),
    ]);
    const animatedGap = createAnimatedValue(ANIMATION_SPEED, (x) => x, [
      getTrackedProp("GAP"),
    ]);
    const animatedZoom = createAnimatedValue(ANIMATION_SPEED, (x) => x, [
      getTrackedProp("ZOOM"),
    ]);
    const animatedSizes = createAnimatedArray(
      ANIMATION_SPEED,
      (x) => range(x).map(() => 1),
      [getTrackedProp("RESOLUTION")],
      0,
    );

    return {
      draw: () => {
        return () => {
          p.background("black");
          p.stroke("white");
          p.strokeWeight(0.5);

          const time = getTime();
          const cameraDistance = animatedZoom.value!;
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

          const cubeSize = animatedCubeSize.value!;
          const resolution = animatedSizes.value.length;
          const totalLen = resolution * 2 + 1;
          const totalSize = totalLen * cubeSize;
          const middleIndex = Math.floor(totalLen / 2);

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

                const sizeX = x === middleIndex ? 1 : animatedSizes.value[xi];
                const sizeY = y === middleIndex ? 1 : animatedSizes.value[yi];
                const sizeZ = z === middleIndex ? 1 : animatedSizes.value[zi];
                size = Math.min(sizeX, sizeY, sizeZ);
              }

              const boxRelativeSize = size / (1 + animatedGap.value!);
              p.box(boxRelativeSize, boxRelativeSize, boxRelativeSize);
            },
          });
        };
      },
      in3D: true,
    };
  },
);
