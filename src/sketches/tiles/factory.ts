import { createSketch } from "@/core/createSketch";
import { oscillateBetween, flatSin } from "@/core/utils";
import { OccupancyGrid } from "@/utils/OccupancyGrid";
import { Rectangle } from "@/utils/Rectangle";
import { Vector } from "@/utils/Vector";
import { Tiler } from "./Turtle";
import type { Controls } from "./controls";

export const ANIMATION_SPEED = 25;
export const SHRINK_OFFSET = 0.25;
export const GROW_OFFSET = 0.1;
export const BG = "black";

export const factory = createSketch<Controls>(
  ({
    p,
    createMemo,
    getTrackedParam,
    getCanvasSize,
    createAnimatedValue,
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
    const animatedGap = createAnimatedValue({
      animationDuration: ANIMATION_SPEED,
      fn: (x, { unitSize }) => x / (unitSize.y * 2.5),
      deps: [getTrackedParam("GAP"), gridInfo.getTrackedValue()],
    });
    const animatedHollowness = createAnimatedValue({
      animationDuration: ANIMATION_SPEED,
      fn: (x) => x,
      deps: [getTrackedParam("HOLLOWNESS")],
    });
    const animatedBorderRadius = createAnimatedValue({
      animationDuration: ANIMATION_SPEED,
      fn: (x) => x,
      deps: [getTrackedParam("BORDER_RADIUS")],
    });
    const bgColor = p.color(BG);

    return {
      draw: () => {
        const time = getTime();
        const { offset, unitSize } = gridInfo.getValue();
        const gap = animatedGap.getValue();
        const hollowness = animatedHollowness.getValue();
        const borderRadius = animatedBorderRadius.getValue();
        const animationEnabled = getParam("ANIMATED");
        const animationProgress = animationEnabled
          ? oscillateBetween({
              p,
              start: 0,
              end: 1,
              timeMultiplier: 0.02,
              time: time,
              timeFunc: flatSin(p, GROW_OFFSET, 0, SHRINK_OFFSET),
            })
          : 1;

        p.background(bgColor);
        p.noStroke();
        p.scale(unitSize.x, unitSize.y);
        p.translate(offset, offset);

        tiles.getValue().forEach((tile, i, arr) => {
          const colorValue = p.map(i / arr.length, 0, 1, 0.1, 0.75);
          const color = p.lerpColor(
            p.color("white"),
            i % 3 == 0
              ? p.color("red")
              : i % 3 == 1
                ? p.color("teal")
                : p.color("purple"),
            colorValue,
          );
          const smallestSize = tile.getSmallestSize();
          const fullWidth = tile.width / 2 - gap;
          const fullHeight = tile.height / 2 - gap;
          const width = fullWidth * animationProgress;
          const height = fullHeight * animationProgress;
          const zebraRaw = getParam("ZEBRA");
          const zebraCount = zebraRaw === 0 ? 0 : zebraRaw * 2 + 1;
          const borderTotalLength = 1 - hollowness;

          p.push();
          {
            p.fill(color);
            p.rectMode("radius");
            p.translate(tile.center.x, tile.center.y);

            p.rect(0, 0, width, height, borderRadius);

            if (
              hollowness > 0 &&
              borderTotalLength < width &&
              borderTotalLength < height
            ) {
              const innerWidth = width - borderTotalLength;
              const innerHeight = height - borderTotalLength;
              const innerRadius =
                1 *
                ((smallestSize - borderTotalLength) / smallestSize) *
                borderRadius;

              p.fill(bgColor);
              p.rect(0, 0, innerWidth, innerHeight, innerRadius);

              if (zebraCount) {
                for (let i = 0; i < zebraCount; i++) {
                  const currColor = i % 2 === 0 ? bgColor : color;
                  const currWidth = innerWidth - i * borderTotalLength;
                  const currHeight = innerHeight - i * borderTotalLength;
                  const currRadius =
                    (innerRadius * (zebraCount - i)) / (zebraCount + 2);

                  if (currWidth < 0 || currHeight < 0) {
                    break;
                  }

                  p.fill(currColor);
                  p.rect(0, 0, currWidth, currHeight, currRadius);
                }
              }
            }
          }
          p.pop();
        });

        // drawCoordinatesGrid(p, size.x, size.y);
      },
    };
  },
);
