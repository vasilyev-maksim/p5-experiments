import { Grid } from "./Grid";
import { Size } from "./Size";
import { Matrix } from "./Matrix";
import { Turtle } from "./Turtle";
import { type IRectangle } from "./Rectangle";
import { StaggerAnimation } from "./StaggerAnimation";
import type { ISketchFactory } from "../../models";
import { easeInOutQuad, getQsParam } from "@/core/utils";

export const tiles: ISketchFactory =
  ({ initialCanvasWidth, initialCanvasHeight, initialRandomSeed }) =>
  (p) => {
    const GRID_CELLS_Y = Number(getQsParam("y", "20")),
      CANVAS_PADDING = 3,
      PADDING = 3,
      GRID_SIZE = new Size(
        Math.round((GRID_CELLS_Y * initialCanvasWidth) / initialCanvasHeight),
        GRID_CELLS_Y,
      ),
      GRID_ORIGIN = p.createVector(CANVAS_PADDING, CANVAS_PADDING),
      MAX_AREA = 0.08,
      REVERSE = getQsParam("r", "1") === "1",
      ANIMATION_SPEED = parseInt(getQsParam("s", "10")),
      grid = new Grid(p, {
        origin: GRID_ORIGIN,
        gridSizeInPixels: new Size(
          initialCanvasWidth - CANVAS_PADDING * 2,
          initialCanvasHeight - CANVAS_PADDING * 2,
        ),
        gridSizeInCells: GRID_SIZE,
        color: "#CCC",
      }),
      matrix = new Matrix(GRID_SIZE, () => p.random()),
      rectsToDraw: IRectangle[] = [],
      animation: StaggerAnimation = new StaggerAnimation(ANIMATION_SPEED);

    p.setup = () => {
      p.createCanvas(initialCanvasWidth, initialCanvasHeight);
      p.randomSeed(initialRandomSeed);

      while (spawnTurtle()) {
        // noop
      }
    };

    p.updateWithProps = (props) => {
      if (props.playing) {
        p.loop();
      } else {
        p.noLoop();
      }
    };

    const spawnTurtle = () => {
      const randomOrigin = matrix.getRandomTrue();
      if (!randomOrigin) {
        return false;
      }

      const turtle = new Turtle(randomOrigin, {
        isForwardPossible: (cell) => {
          return matrix.get(cell);
        },
        onCommit: (rect) => {
          if (!rect) {
            return;
          }
          rect.getPointsRange().forEach((p) => {
            matrix.set(p, false);
          });

          if (rect.getArea() > 0) {
            rectsToDraw.push(rect);
          }
        },
        rectEvaluator: (rect) => {
          const area = rect.getArea();
          const gridArea = GRID_SIZE.getArea();
          const maxArea = MAX_AREA * gridArea;

          if (area > maxArea || rect.getAspectRatio() > 2) return 0;

          return maxArea - area;
        },
      });

      turtle.coverRandomRectangle();
      return true;
    };

    p.mouseClicked = spawnTurtle;

    p.draw = () => {
      p.background("black");
      p.fill("#AAA");
      p.strokeWeight(2);
      // grid.render();

      (REVERSE ? rectsToDraw.slice().reverse() : rectsToDraw).forEach(
        (cellRect, i, arr) => {
          const time = p.frameCount;
          const canvasRect = grid.getCanvasRectangleFromVertexCells(cellRect);
          const animationProgress =
            time < 0 ? 1 : animation.getAnimationProgress(time, i);
          // const animationProgress = 1;
          const colorValue = p.map(1 - i / arr.length, 0, 1, 0.1, 0.75);
          // const area = cellRect.getArea();
          // const gridArea = GRID_SIZE.getArea();

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

          const scale = easeInOutQuad(animationProgress);
          const scaledRect = canvasRect.scale(scale);
          const direction = [
            p.createVector(1, 0),
            p.createVector(0, 1),
            p.createVector(-1, 0),
            p.createVector(0, -1),
          ][i % 4];

          p.strokeWeight(1);
          p.rect(
            scaledRect.topLeft.x + PADDING + direction.x * (1 - scale) * 200,
            scaledRect.topLeft.y + PADDING + direction.y * (1 - scale) * 200,
            Math.max(scaledRect.width - 2 - PADDING * 2, 0), // TODO: fix this (-2)
            Math.max(scaledRect.height - 2 - PADDING * 2, 0),
            10,
          );
        },
      );
    };
  };
