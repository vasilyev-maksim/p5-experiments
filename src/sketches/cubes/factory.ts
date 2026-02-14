import { createSketch } from "@/core/createSketch";
import { range } from "@/utils/misc";
import type { Controls } from "./controls";

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
      setup: () => {
        // p.setAttributes("antialias", false);
      },
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
          const offset = -(totalSize / 2);

          p.translate(offset, offset, offset);

          p.push();
          for (let y = 0; y < totalLen; y++) {
            p.push();
            for (let z = 0; z < totalLen; z++) {
              p.push();
              {
                p.translate(0, cubeSize / 2, cubeSize / 2);
                for (let x = 0; x < totalLen; x++) {
                  p.translate(cubeSize / 2, 0, 0);

                  let size = cubeSize;
                  if (
                    !(
                      x === middleIndex &&
                      y === middleIndex &&
                      z === middleIndex
                    )
                  ) {
                    const xi =
                      x < middleIndex
                        ? resolution - x - 1
                        : x - (middleIndex + 1);
                    const yi =
                      y < middleIndex
                        ? resolution - y - 1
                        : y - (middleIndex + 1);
                    const zi =
                      z < middleIndex
                        ? resolution - z - 1
                        : z - (middleIndex + 1);

                    const sizeX =
                      cubeSize *
                      (x === middleIndex ? 1 : animatedSizes.value[xi]);
                    const sizeY =
                      cubeSize *
                      (y === middleIndex ? 1 : animatedSizes.value[yi]);
                    const sizeZ =
                      cubeSize *
                      (z === middleIndex ? 1 : animatedSizes.value[zi]);
                    size = Math.min(sizeX, sizeY, sizeZ);
                  }

                  const boxRelativeSize = size / (1 + animatedGap.value!);
                  p.box(boxRelativeSize, boxRelativeSize, boxRelativeSize);

                  p.translate(cubeSize / 2, 0, 0);
                }
              }
              p.pop();
              p.translate(0, 0, cubeSize);
            }
            p.pop();
            p.translate(0, cubeSize, 0);
          }
          p.pop();
        };
      },
      in3D: true,
    };
  },
);
