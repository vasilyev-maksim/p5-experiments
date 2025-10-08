import type { P5CanvasInstance } from "@p5-wrapper/react";
import type { ISketchFactory } from "../models";

export const spiral: ISketchFactory<
  "n" | "t" | "as" | "bs" | "s" | "ls" | "cs" | "sf"
> =
  (WIDTH, HEIGHT, _randomSeed, timeShift) =>
  (
    p: P5CanvasInstance<{
      playing: boolean;
      n: number;
      t: number;
      as: number;
      bs: number;
      s: number;
      ls: number;
      cs: number;
      sf: number;
    }>
  ) => {
    let N = 3,
      THICKNESS = 4,
      ANGULAR_SPEED = 2,
      BRUSH_SPEED = 2,
      SPEED = 1,
      LINEAR_SPEED = 1.5,
      COLOR_SPEED = 1,
      SPEED_FACTOR = 1;

    function getTime() {
      return (p.frameCount + timeShift) / SPEED_FACTOR;
    }

    p.updateWithProps = (props) => {
      N = props.n;
      THICKNESS = props.t;
      ANGULAR_SPEED = props.as;
      BRUSH_SPEED = props.bs;
      SPEED = props.s;
      LINEAR_SPEED = props.ls;
      COLOR_SPEED = props.cs;
      SPEED_FACTOR = props.sf;

      if (props.playing) {
        p.loop();
      } else {
        p.noLoop();
      }
    };

    p.setup = () => {
      p.createCanvas(WIDTH, HEIGHT);
      p.background("black");
      p.fill(255, 0, 0, 10);
      p.stroke(p.color("rgba(255, 0, 0, 1)"));
      p.strokeWeight(1);
      p.angleMode("degrees");
    };

    function getNodes(): [number, number][] {
      return Array.from({ length: 500 }, (_, i) => {
        return [
          i * BRUSH_SPEED,
          i * ANGULAR_SPEED * (SPEED === 0 ? 1 : p.sin(getTime() / SPEED)) +
            getTime() * LINEAR_SPEED,
        ];
      });
    }

    function drawCircle([d, angle]: [number, number]) {
      const x = d * p.cos(angle);
      const y = d * p.sin(angle);
      p.circle(WIDTH / 2 + x, HEIGHT / 2 + y, (d * 2) / THICKNESS);
    }

    // function drawSquare([d, angle]: [number, number]) {
    //   const x = d * p.cos(angle);
    //   const y = d * p.sin(angle);
    //   const s = d / 3;
    //   p.square(WIDTH / 2 + x, HEIGHT / 2 + y, s);
    // }

    function drawPolygon([d, angle]: [number, number]) {
      const x = d * p.cos(angle) + WIDTH / 2;
      const y = d * p.sin(angle) + HEIGHT / 2;
      const adelta = 360 / N;

      p.push();
      {
        p.translate(x, y);
        p.beginShape();
        for (let a = 0; a < 360; a += adelta) {
          const sx = (p.cos(a) * d) / THICKNESS;
          const sy = (p.sin(a) * d) / THICKNESS;
          p.vertex(sx, sy);
        }
        p.endShape("close");
      }
      p.pop();
    }

    function getColor(i: number, maxI: number) {
      return p.lerpColor(
        p.color("rgba(103, 3, 116, 1)"),
        p.color("rgba(45, 1, 147, 1)"),
        p.sin(getTime() * COLOR_SPEED + (i / maxI) * 360 * 4)
      );
    }

    p.draw = () => {
      p.background("black");
      const nodes = getNodes();
      nodes.forEach((x, i, arr) => {
        const color = getColor(i, arr.length);
        p.fill(color);
        if (N > 10) {
          drawCircle(x);
        } else {
          drawPolygon(x);
        }
      });
    };
  };
