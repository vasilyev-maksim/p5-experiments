import type { P5CanvasInstance } from "@p5-wrapper/react";

export const sketchFactory =
  (WIDTH: number, HEIGHT: number) => (p: P5CanvasInstance) => {
    const // WIDTH = window.innerWidth,
      //   HEIGHT = window.innerHeight,
      ANGULAR_SPEED = 2,
      BRUSH_SPEED = 2;

    let N = 3,
      THICKNESS = 4;

    function getTime() {
      return p.frameCount + 1000;
    }

    // let time = 0;

    p.updateWithProps = (props) => {
      if (props.n) {
        N = props.n as number;
      }

      if (props.t) {
        THICKNESS = props.t as number;
      }

      if (props.p) {
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
      // p.noLoop();
    };

    function getNodes(): [number, number][] {
      return Array.from({ length: 500 }, (_, i) => {
        return [
          i * BRUSH_SPEED,
          i * ANGULAR_SPEED * p.sin(getTime()) + getTime() * 1.5,
        ];
      });
    }

    // function drawCircle([d, angle]: [number, number]) {
    //   const x = d * p.cos(angle);
    //   const y = d * p.sin(angle);
    //   p.circle(WIDTH / 2 + x, HEIGHT / 2 + y, d);
    // }

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
        p.sin(getTime() * 1 + (i / maxI) * 4 * 360)
      );
    }

    p.draw = () => {
      p.background("black");
      const nodes = getNodes();
      nodes.forEach((x, i, arr) => {
        const color = getColor(i, arr.length);
        p.fill(color);
        return drawPolygon(x);
      });
    };

    // p.mouseClicked = () => N++;
  };
