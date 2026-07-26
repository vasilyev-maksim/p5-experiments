import { createSketch } from "@/core/createSketch";
import { OccupancyGrid } from "@/utils/OccupancyGrid";
import { Rectangle } from "@/utils/Rectangle";
import { Vector } from "@/utils/Vector";
import { Tiler } from "./Turtle";
import { AnimationType, controls, FillType, type Controls } from "./controls";
import { drawCoordinatesGrid } from "../_utils/drawCoordinatesGrid";
import type { Color } from "p5";

const DRAW_COORDS_GRID = false;
const BG = "black";
const CONTROL_ANIMATION_SPEED = 25;
const COLOR_INTENSITY_MIN = 0.1;
const COLOR_INTENSITY_MAX = 0.9;
const ALTERNATIVE_COLOR_INTENSITY_MIN = 0.2;
const ALTERNATIVE_COLOR_INTENSITY_MAX = 0.75;
const ANIMATION_DURATION = 120;
const ANIMATION_DELAY = 250;
const SCALE_MAX_DELTA = -0.2;
const STRIPE_SIZE_MAX_DELTA = 0.1;
const BORDER_RADIUS_MAX_DELTA = 2;
const CANVAS_OFFSET = 0.5;

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
        const resX = p.round((canvasWidth * resY) / canvasHeight);
        const gridRect = new Rectangle(
          new Vector(0, 0),
          new Vector(resX - 1, resY - 1),
        );
        const unitSize = p.createVector(
          canvasWidth / (gridRect.width + CANVAS_OFFSET * 2),
          canvasHeight / (gridRect.height + CANVAS_OFFSET * 2),
        );
        return {
          gridRect,
          offset: CANVAS_OFFSET,
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

    const tilesWithSorting = createMemo({
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

            default:
              return 0;
          }
        });

        return unsortedTiles.map((tile, i) => ({
          tile,
          distanceIndex: sortedTiles.indexOf(tile),
          originalIndex: i,
        }));
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
      fn: (x) => p.map(x, controls.GAP.min, controls.GAP.max, 0.005, 0.25),
      deps: [getTrackedParam("GAP")],
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

    const isAlternativeColoringMemo = createMemo({
      deps: [getTrackedParam("COLOR")],
      fn: (x) => x === controls.COLOR.colors.length - 1,
    });

    const animatedColors = createAnimatedColors({
      animationDuration: CONTROL_ANIMATION_SPEED,
      deps: [getTrackedParam("COLOR"), getTrackedParam("INVERT_COLORS")],
      colorProvider: (x, inverted) => {
        const colorTuple = controls.COLOR.colors[x];
        return colorTuple.length === 2 && inverted
          ? [...colorTuple].reverse()
          : colorTuple;
      },
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
        const isAlternativeColoring = isAlternativeColoringMemo.getValue();

        p.background(bgColor);
        p.noStroke();
        p.scale(unitSize.x, unitSize.y);
        p.translate(offset, offset);

        tilesWithSorting
          .getValue()
          .forEach(({ tile, originalIndex, distanceIndex }, _, { length }) => {
            const colorIndex = isAlternativeColoring
              ? originalIndex
              : distanceIndex;
            const baseColorValue = colorIndex / (length - 1);
            let color: Color;

            if (isAlternativeColoring) {
              const colors = animatedColors.getValue();

              const colorValue = p.map(
                baseColorValue,
                0,
                1,
                ALTERNATIVE_COLOR_INTENSITY_MIN,
                ALTERNATIVE_COLOR_INTENSITY_MAX,
              );

              color = p.lerpColor(
                p.color(colors[0]), // TODO:  fix hardcode, make loop
                colorIndex % 3 == 0
                  ? p.color(colors[1])
                  : colorIndex % 3 == 1
                    ? p.color(colors[2])
                    : p.color(colors[3]),
                colorValue,
              );
            } else {
              const [colorA, colorB] = animatedColors.getValue();
              const colorValue = p.map(
                baseColorValue,
                0,
                1,
                COLOR_INTENSITY_MIN,
                COLOR_INTENSITY_MAX,
              );
              color = p.lerpColor(colorA, colorB, colorValue);
            }

            const smallestSize = tile.getSmallestSize();
            const fullWidth = tile.width / 2 - gap;
            const fullHeight = tile.height / 2 - gap;

            let delta = 0;

            if (animationEnabled) {
              const relativeTime = Math.max(0, time - distanceIndex) % PERIOD;
              const x = relativeTime / ANIMATION_DURATION;
              delta =
                relativeTime < ANIMATION_DURATION
                  ? p.sin(x * p.TWO_PI - p.HALF_PI) / 2 + 0.5
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
                      ((smallestSize - borderSize) / smallestSize) *
                      borderRadius;

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
