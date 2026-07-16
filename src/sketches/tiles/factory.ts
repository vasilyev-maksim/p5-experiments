import { createSketch } from "@/core/createSketch";
import { OccupancyGrid } from "@/utils/OccupancyGrid";
import { Rectangle } from "@/utils/Rectangle";
import { Vector } from "@/utils/Vector";
import { Tiler } from "./Turtle";
import { AnimationType, controls, FillType, type Controls } from "./controls";
import { drawCoordinatesGrid } from "../_utils/drawCoordinatesGrid";
// import { triangleWave } from "@/core/utils";

const DRAW_COORDS_GRID = false;
const BG = "black";
const CONTROL_ANIMATION_SPEED = 25;
const COLOR_INTENSITY_MAX = 1;
const COLOR_INTENSITY_MIN = 0;
const ANIMATION_DURATION = 100;
const ANIMATION_DELAY = 250;
const SCALE_MAX_DELTA = -0.2;
const STRIPE_SIZE_MAX_DELTA = 0.1;
const BORDER_RADIUS_MAX_DELTA = 2;

export const factory = createSketch<Controls>(
  ({
    p,
    createMemo,
    getTrackedParam,
    getCanvasSize,
    createAnimatedValue,
    createAnimatedColors,
    getTime,
    getParam,
  }) => {
    const { trackedCanvasHeight, trackedCanvasWidth } = getCanvasSize();
    const gridInfo = createMemo({
      fn: (canvasWidth, canvasHeight, resY) => {
        const OFFSET = 0.5;
        const resX = p.round((canvasWidth * resY) / canvasHeight);
        const gridRect = new Rectangle(
          new Vector(0, 0),
          new Vector(resX - 1, resY - 1),
        );
        const unitSize = p.createVector(
          canvasWidth / (gridRect.width + OFFSET * 2),
          canvasHeight / (gridRect.height + OFFSET * 2),
        );
        return {
          gridRect,
          offset: OFFSET,
          unitSize,
        };
      },
      deps: [
        trackedCanvasWidth,
        trackedCanvasHeight,
        getTrackedParam("RESOLUTION"),
      ],
    });

    const tiles = createMemo({
      fn: ({ gridRect }, maxAreaRelative, seed) => {
        p.randomSeed(seed);

        const og = new OccupancyGrid(gridRect.width, gridRect.height, () =>
          p.random(),
        );
        const maxArea = (maxAreaRelative / 100) * gridRect.getArea();
        const tiles = new Tiler(og, (rect) => {
          const area = rect.getArea();

          if (area > maxArea || rect.getAspectRatio() > 2) return 0;

          return area;
        }).randomTiling();

        return tiles;
      },
      deps: [
        gridInfo.getTrackedValue(),
        getTrackedParam("MAX_TILE_AREA"),
        getTrackedParam("RANDOM_SEED"),
      ],
    });

    const tilesSortResult = createMemo({
      fn: (
        unsortedTiles,
        { gridRect },
        animationType,
        [centerX, centerY],
        [directionX, directionY],
      ) => {
        const sortedTiles = [...unsortedTiles].sort((a, b) => {
          switch (animationType) {
            case AnimationType.Static:
            case AnimationType.Linear: {
              const originVec = new Vector(directionX - 0.5, directionY - 0.5);
              const angle = p.HALF_PI - originVec.heading();
              const distA = a.center.rotate(angle).y;
              const distB = b.center.rotate(angle).y;
              return distA - distB;
            }

            case AnimationType.Radial: {
              const origin = new Vector(
                centerX * gridRect.width,
                centerY * gridRect.height,
              );
              const distA = a.center.sub(origin).mag();
              const distB = b.center.sub(origin).mag();
              return distA - distB;
            }

            // case AnimationType.Rectangular: {
            //   const origin = new Vector(
            //     centerX * gridRect.width,
            //     centerY * gridRect.height,
            //   );
            //   let tmp = a.center.sub(origin);
            //   const distA = p.max(p.abs(tmp.x), p.abs(tmp.y));

            //   tmp = b.center.sub(origin);
            //   const distB = p.max(p.abs(tmp.x), p.abs(tmp.y));

            //   return distA - distB;
            // }

            // case AnimationType.Rhombus: {
            //   const origin = new Vector(
            //     centerX * gridRect.width,
            //     centerY * gridRect.height,
            //   );
            //   let tmp = a.center.sub(origin);
            //   const distA = p.abs(tmp.x) + p.abs(tmp.y);

            //   tmp = b.center.sub(origin);
            //   const distB = p.abs(tmp.x) + p.abs(tmp.y);

            //   return distA - distB;
            // }

            default:
              return 0;
          }
        });

        return { unsortedTiles, sortedTiles };
      },
      deps: [
        tiles.getTrackedValue(),
        gridInfo.getTrackedValue(),
        getTrackedParam("ANIMATION_TYPE"),
        getTrackedParam("ANIMATION_CENTER"),
        getTrackedParam("ANIMATION_DIRECTION"),
      ],
    });

    const animatedGap = createAnimatedValue({
      animationDuration: CONTROL_ANIMATION_SPEED,
      fn: (x, { unitSize }) => x / (unitSize.y * 2.5),
      deps: [getTrackedParam("GAP"), gridInfo.getTrackedValue()],
    });

    const animatedBorderRadius = createAnimatedValue({
      animationDuration: CONTROL_ANIMATION_SPEED,
      fn: (x) => x,
      deps: [getTrackedParam("BORDER_RADIUS")],
    });

    const animatedStripeSize = createAnimatedValue({
      animationDuration: CONTROL_ANIMATION_SPEED,
      fn: (x) => p.map(x, 0, controls.STRIPE_SIZE.max, 0, 1),
      deps: [getTrackedParam("STRIPE_SIZE")],
    });

    const animatedBorderSize = createAnimatedValue({
      animationDuration: CONTROL_ANIMATION_SPEED,
      fn: (x) => p.map(x, 0, controls.BORDER_SIZE.max, 0, 1),
      deps: [getTrackedParam("BORDER_SIZE")],
    });

    const animatedColors = createAnimatedColors({
      animationDuration: CONTROL_ANIMATION_SPEED,
      deps: [getTrackedParam("COLOR"), getTrackedParam("INVERT_COLORS")],
      colorProvider: (x, inverted) => [
        controls.COLOR.colors[x][inverted ? 1 : 0],
        controls.COLOR.colors[x][inverted ? 0 : 1],
      ],
      p,
    });

    const bgColor = p.color(BG);

    return {
      draw: () => {
        const time = getTime();
        const { offset, unitSize } = gridInfo.getValue();
        const { gridRect } = gridInfo.getValue();
        const gap = animatedGap.getValue();
        const borderSize = animatedBorderSize.getValue();
        const baseBorderRadius = animatedBorderRadius.getValue();
        const animationType = getParam("ANIMATION_TYPE");
        const animationEnabled = animationType !== 0;
        const fillType = getParam("FILL_TYPE");
        const stripeSize = animatedStripeSize.getValue();
        const PERIOD = ANIMATION_DURATION + ANIMATION_DELAY;
        const { sortedTiles } = tilesSortResult.getValue();
        const [colorA, colorB] = animatedColors.getValue();

        p.background(bgColor);
        p.noStroke();
        p.scale(unitSize.x, unitSize.y);
        p.translate(offset, offset);

        sortedTiles.forEach((tile, i) => {
          const colorValue = p.map(
            i / (sortedTiles.length - 1),
            0,
            1,
            COLOR_INTENSITY_MIN,
            COLOR_INTENSITY_MAX,
          );
          // const color = p.lerpColor(
          //   p.color("white"),
          //   i % 3 == 0
          //     ? p.color("red")
          //     : i % 3 == 1
          //       ? p.color("teal")
          //       : p.color("purple"),
          //   colorValue,
          // );
          const color = p.lerpColor(colorA, colorB, colorValue);
          const smallestSize = tile.getSmallestSize();
          const fullWidth = tile.width / 2 - gap;
          const fullHeight = tile.height / 2 - gap;

          let delta = 0;

          if (animationEnabled) {
            const relativeTime = Math.max(0, time - i) % PERIOD;
            const x = relativeTime / ANIMATION_DURATION;
            delta =
              relativeTime < ANIMATION_DURATION
                ? //triangleWave(p)(x * 2 - 1) / 2 + 0.5
                  p.sin(x * p.TWO_PI - p.HALF_PI) / 2 + 0.5
                : 0;
          }
          const borderRadius =
            baseBorderRadius + delta * BORDER_RADIUS_MAX_DELTA;
          const width = fullWidth + delta * SCALE_MAX_DELTA;
          const height = fullHeight + delta * SCALE_MAX_DELTA;

          p.push();
          {
            p.fill(color);
            p.rectMode("radius");
            p.translate(tile.center.x, tile.center.y);

            p.rect(0, 0, width, height, borderRadius);

            switch (fillType) {
              case FillType.Solid:
                break;
              case FillType.Hollow:
                if (borderSize < width && borderSize < height) {
                  const innerWidth = width - borderSize;
                  const innerHeight = height - borderSize;
                  const innerRadius =
                    ((smallestSize - borderSize) / smallestSize) * borderRadius;

                  p.fill(bgColor);
                  p.rect(0, 0, innerWidth, innerHeight, innerRadius);
                }
                break;
              case FillType.Zebra: {
                const size = stripeSize + delta * STRIPE_SIZE_MAX_DELTA;

                const zebraCount = Math.floor((smallestSize / size) * 2);
                for (let i = 0; i < zebraCount; i++) {
                  const currColor = i % 2 === 1 ? bgColor : color;
                  const currWidth = width - i * size;
                  const currHeight = height - i * size;
                  const currRadius =
                    (borderRadius * (zebraCount - i)) / zebraCount;

                  if (currWidth < 0 || currHeight < 0) {
                    break;
                  }

                  p.fill(currColor);
                  p.rect(0, 0, currWidth, currHeight, currRadius);
                }
                break;
              }
            }
          }
          p.pop();
        });

        if (DRAW_COORDS_GRID) {
          const gridSize = gridRect.getSize();
          drawCoordinatesGrid(p, gridSize.x, gridSize.y);
        }
      },
    };
  },
);
