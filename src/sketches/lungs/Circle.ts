import type p5 from "p5";

export class Circle {
  public constructor(
    private readonly center: p5.Vector,
    private readonly radius: number,
    private readonly fillColor: p5.Color,
    private readonly rotationCenter: p5.Vector,
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
