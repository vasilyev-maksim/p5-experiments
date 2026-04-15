import { Vector } from "@utils/Vector";
import { type IRectangle, Rectangle } from "@utils/Rectangle";
import p5 from "p5";

export interface IGridParams {
  origin: p5.Vector;
  gridSizeInPixels: p5.Vector;
  gridSizeInCells: p5.Vector;
  color: string;
}

interface IGridConfig extends IGridParams {
  cellSize: p5.Vector;
}

export class Grid {
  public config: IGridConfig;

  constructor(
    private p: p5,
    initParams: IGridParams,
  ) {
    this.config = {
      ...initParams,
      cellSize: new p5.Vector(
        initParams.gridSizeInPixels.x / initParams.gridSizeInCells.x,
        initParams.gridSizeInPixels.y / initParams.gridSizeInCells.y,
      ),
    };
  }

  render() {
    this.p.push();
    {
      this.p.translate(this.config.origin.x, this.config.origin.y);
      this.p.stroke(this.config.color);

      // vertical lines
      for (let cx = 0; cx <= this.config.gridSizeInCells.x; cx++) {
        const x = cx * this.config.cellSize.x;
        this.p.line(x, 0, x, this.config.gridSizeInPixels.y);

        if (cx !== 0) {
          this.p.push();
          {
            this.p.fill("white");
            this.p.textAlign(this.p.CENTER);
            this.p.strokeWeight(1);
            this.p.text(cx, x - this.config.cellSize.x / 2, -5);
            this.p.text(
              cx,
              x - this.config.cellSize.x / 2,
              this.config.gridSizeInPixels.y + 15,
            );
          }
          this.p.pop();
        }
      }

      // horizontal lines
      for (let cy = 0; cy <= this.config.gridSizeInCells.y; cy++) {
        const y = cy * this.config.cellSize.y;
        this.p.line(0, y, this.config.gridSizeInPixels.x, y);

        if (cy !== 0) {
          this.p.push();
          {
            this.p.fill("white");
            this.p.textAlign(this.p.RIGHT);
            this.p.strokeWeight(1);
            this.p.text(cy, -5, y - this.config.cellSize.y / 2 + 5);
            this.p.textAlign(this.p.LEFT);
            this.p.text(
              cy,
              this.config.gridSizeInPixels.x + 5,
              y - this.config.cellSize.y / 2 + 5,
            );
          }
          this.p.pop();
        }
      }
    }
    this.p.pop();
  }

  getCanvasRectangleFromCell(cell: Vector) {
    const tl = new Vector(
      (cell.x - 1) * this.config.cellSize.x + this.config.origin.x,
      (cell.y - 1) * this.config.cellSize.y + this.config.origin.y,
    );
    const br = new Vector(
      cell.x * this.config.cellSize.x + this.config.origin.x,
      cell.y * this.config.cellSize.y + this.config.origin.y,
    );
    return new Rectangle(tl, br);
  }

  getCanvasRectangleFromVertexCells(rect: IRectangle) {
    const canvasTopLeft = this.getCanvasRectangleFromCell(rect.topLeft).topLeft;
    const canvasBottomRight = this.getCanvasRectangleFromCell(
      rect.bottomRight,
    ).bottomRight;
    return new Rectangle(canvasTopLeft, canvasBottomRight);
  }
}
