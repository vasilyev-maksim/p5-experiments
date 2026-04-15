import { OccupancyGrid } from "@utils/OccupancyGrid";
import { Tiler } from "./Turtle";
import type { IControls, IPreset, ISketch } from "../../models";
import { getQsParam } from "@/core/utils";
import { createSketch } from "@/core/createSketch";

export type Controls = typeof controls;

const controls = {
  RANDOM_SEED: {
    type: "range",
    min: 0,
    max: 1000,
    step: 1,
    label: "Random seed",
  },
  RESOLUTION: {
    type: "range",
    min: 2,
    max: 60,
    step: 1,
    label: "Resolution",
  },
  THICKNESS: {
    type: "range",
    min: 0.05,
    max: 0.95,
    step: 0.05,
    label: "Thickness",
    valueFormatter: (x) => x.toFixed(2),
  },
  INNER_THICKNESS: {
    type: "range",
    min: 0,
    max: 0.95,
    step: 0.05,
    label: "Hollowness",
    valueFormatter: (x) => x.toFixed(2),
  },
} as const satisfies IControls;

export const factory = createSketch<Controls>(
  ({ p, getTime, createMemo, getTrackedParam, getCanvasSize, getParam }) => {
    const { trackedCanvasHeight, trackedCanvasWidth } = getCanvasSize();
    const gridInfo = createMemo({
      fn: (w, h, resY) => {
        const resX = p.round((w * resY) / h);
        const size = p.createVector(resX, resY);
        const max = p.createVector(resX - 1, resY - 1);
        const area = size.x * size.y;
        return {
          max,
          size,
          area,
        };
      },
      deps: [
        trackedCanvasWidth,
        trackedCanvasHeight,
        getTrackedParam("RESOLUTION"),
      ],
    });
    const tiles = createMemo({
      fn: ({ size, area }, seed) => {
        p.randomSeed(seed);
        const og = new OccupancyGrid(size.x, size.y, () => p.random());
        const MAX_AREA = 0.38; // TODO:
        const maxArea = MAX_AREA * area;
        const tiles = new Tiler(og, (rect) => {
          const area = rect.getArea();

          // if (area > maxArea) return 0;
          if (area > maxArea || rect.getAspectRatio() > 2) return 0;

          return area;
        }).randomTiling();

        return tiles;
      },
      deps: [gridInfo.getTrackedValue(), getTrackedParam("RANDOM_SEED")],
    });
    const // GRID_CELLS_Y = Number(getQsParam("y", "20")),
      // CANVAS_PADDING = 3,
      // PADDING = 3,
      // GRID_SIZE = p.createVector(
      //   Math.round((GRID_CELLS_Y * p.width) / p.height),
      //   GRID_CELLS_Y,
      // ),
      // GRID_ORIGIN = p.createVector(CANVAS_PADDING, CANVAS_PADDING),
      // MAX_AREA = 0.38,
      // MAX_AREA = 0.08,
      // MAX_AREA = 0.02,
      REVERSE = getQsParam("r", "1") === "1";
    // ANIMATION_SPEED = parseInt(getQsParam("s", "7")),
    // animation: StaggerAnimation = new StaggerAnimation(ANIMATION_SPEED);

    return {
      draw: () => {
        const { size } = gridInfo.getValue();
        const { canvasHeight, canvasWidth } = getCanvasSize();
        const offset = 0.5;
        const xScaleFactor = canvasWidth / (size.x + offset * 2);
        const yScaleFactor = canvasHeight / (size.y + offset * 2);
        const scale = getParam("THICKNESS");

        p.background("black");
        p.scale(xScaleFactor, yScaleFactor);
        p.translate(offset, offset);
        p.strokeWeight(1 / yScaleFactor);

        tiles.getValue().forEach((tile, i, arr) => {
          // console.log(tile.getArea());
          // const canvasRect = grid.getCanvasRectangleFromVertexCells(tile);
          // const animationProgress =
          //   time < 0 ? 1 : animation.getAnimationProgress(time, i);
          const colorValue = p.map(i / arr.length, 0, 1, 0.1, 0.75);

          const color = p.lerpColor(
            p.color("white"),
            i % 3 == 0
              ? p.color("red")
              : i % 3 == 1
                ? p.color("teal")
                : p.color("purple"),
            REVERSE ? colorValue : 1 - colorValue,
            // 1 - area / (MAX_AREA * gridArea)
          );
          p.fill(color);

          // const scale = easeInOutQuad(animationProgress);
          // const scale = 1;
          const scaledTile = tile.scale(1);
          const scaledTile = tile;
          // const direction = [
          //   p.createVector(1, 0),
          //   p.createVector(0, 1),
          //   p.createVector(-1, 0),
          //   p.createVector(0, -1),
          // ][i % 4];

          // p.rect(
          //   scaledRect.topLeft.x + PADDING + direction.x * (1 - scale) * 200,
          //   scaledRect.topLeft.y + PADDING + direction.y * (1 - scale) * 200,
          //   Math.max(scaledRect.width - 2 - PADDING * 2, 0), // TODO: fix this (-2)
          //   Math.max(scaledRect.height - 2 - PADDING * 2, 0),
          //   10,
          // );

          p.rect(
            scaledTile.topLeft.x,
            scaledTile.topLeft.y,
            scaledTile.width,
            scaledTile.height,
            0,
          );
        });

        // drawCoordinatesGrid(p, size.x, size.y);
      },
    };
  },
);

const presets: IPreset<Controls>[] = [
  {
    params: {
      RESOLUTION: 6,
      THICKNESS: 0.95,
      INNER_THICKNESS: 0,
      RANDOM_SEED: 2,
    },
    timeDelta: 1,
    // randomSeed: 5777,
    name: "0",
  },
];

export const sketch: ISketch<Controls> = {
  factory,
  controls,
  presets,
  type: "draft",
  id: "tiles",
  name: "tiles",
  preview: {
    sizeInPercents: 36,
  },
  startTime: -20,
  // randomSeed: 123,
};
