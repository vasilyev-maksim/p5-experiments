import p5 from "p5";
import { oscillateBetween } from "./utils";
import type { ISketchFactory } from "../models";

class Circle {
  public constructor(
    private readonly center: p5.Vector,
    private readonly radius: number,
    private readonly fillColor: p5.Color,
    private readonly rotationCenter: p5.Vector
  ) {}

  public render = (p: p5, angle: number) => {
    p.push();
    // Перенос системы координат в точку вращения
    p.translate(this.rotationCenter.x, this.rotationCenter.y);

    // Поворот всей системы координат
    p.rotate(angle);

    // Рисуем окружность в её локальной позиции (относительно rotationCenter)
    const localX = this.center.x - this.rotationCenter.x;
    const localY = this.center.y - this.rotationCenter.y;
    p.fill(this.fillColor);
    p.circle(localX, localY, this.radius * 2);

    p.pop();
  };
}

export const lungs: ISketchFactory =
  (WIDTH, HEIGHT, _randomSeed, timeShift) => (p) => {
    function getDirection(i: number) {
      return [
        p.createVector(1, 0),
        p.createVector(-1, 0),
        p.createVector(0, 1),
        p.createVector(0, -1),
      ][i % 2];
    }

    const CENTER_VEC = p.createVector(WIDTH / 2, HEIGHT / 2),
      RINGS_COUNT = 20,
      RD = WIDTH / 120,
      CIRCLES = Array.from({ length: RINGS_COUNT }, (_, i) => {
        const dir = getDirection(i);
        const rotationShiftDelta = (RD / 2) * (i + 1);
        return new Circle(
          CENTER_VEC,
          RD * (i + 1),
          p.lerpColor(
            p.color("#ea72f7ff"),
            p.color("#530984ff"),
            i / RINGS_COUNT
          ),
          p5.Vector.add(
            CENTER_VEC,
            p.createVector(
              dir.x * rotationShiftDelta,
              dir.y * rotationShiftDelta
            )
          )
        );
      }),
      TRACK_MOUSE = false;

    p.setup = () => {
      p.createCanvas(WIDTH, HEIGHT);
      p.noStroke();
      p.angleMode("degrees");
    };

    p.updateWithProps = (props) => {
      if (props.playing) {
        p.loop();
      } else {
        p.noLoop();
      }
    };

    p.draw = () => {
      let angle;
      const time = timeShift + p.frameCount;

      if (TRACK_MOUSE) {
        const mouseVec = p.createVector(
          p.mouseX - CENTER_VEC.x,
          p.mouseY - CENTER_VEC.y
        );
        angle = mouseVec.angleBetween(p.createVector(1, 0));
      } else {
        angle = (time * 2) % 360;
      }

      p.background("#530984ff");

      [...CIRCLES].reverse().forEach((r, i) => {
        const delta = 9 * (i + 1) * oscillateBetween(p, 0, 1, 3, time); // change last param to 3 for more chaos
        const ang = (angle + delta) * (i % 2 == 0 ? 1 : -1);
        r.render(p, ang);
      });
    };
  };
