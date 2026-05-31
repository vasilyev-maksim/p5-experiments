export class Vector {
  public constructor(
    public x: number,
    public y: number,
  ) {}

  public add(v: Vector): Vector {
    return new Vector(this.x + v.x, this.y + v.y);
  }

  public sub(v: Vector): Vector {
    return new Vector(this.x - v.x, this.y - v.y);
  }

  public mag(): number {
    return Math.sqrt(this.x ** 2 + this.y ** 2);
  }

  public normalize(): Vector {
    const mag = this.mag();
    return new Vector(this.x / mag, this.y / mag);
  }

  public equals(v: Vector): boolean {
    return this.x === v.x && this.y === v.y;
  }

  public mult(scalar: number): Vector {
    return new Vector(this.x * scalar, this.y * scalar);
  }

  public heading(): number {
    return Math.atan2(this.y, this.x);
  }

  public rotate(angleInRadians: number): Vector {
    const cos = Math.cos(angleInRadians);
    const sin = Math.sin(angleInRadians);
    return new Vector(
      this.x * cos - this.y * sin,
      this.x * sin + this.y * cos,
    );
  }
}
