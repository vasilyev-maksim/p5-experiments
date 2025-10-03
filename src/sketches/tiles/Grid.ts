import { type IRectangle, Rectangle } from "./Rectangle";
import { Size } from "./Size";
import p5 from "p5";

export interface IGridParams {
  origin: p5.Vector;
  gridSizeInPixels: Size;
  gridSizeInCells: Size;
  color: string;
}

interface IGridConfig extends IGridParams {
  cellSize: Size;
}

export class Grid {
  public config: IGridConfig;

  constructor(private p: p5, initParams: IGridParams) {
    this.config = {
      ...initParams,
      cellSize: new Size(
        initParams.gridSizeInPixels.width / initParams.gridSizeInCells.width,
        initParams.gridSizeInPixels.height / initParams.gridSizeInCells.height
      ),
    };
  }

  render() {
    this.p.push();
    {
      this.p.translate(this.config.origin.x, this.config.origin.y);
      this.p.stroke(this.config.color);

      // vertical lines
      for (let cx = 0; cx <= this.config.gridSizeInCells.width; cx++) {
        const x = cx * this.config.cellSize.width;
        this.p.line(x, 0, x, this.config.gridSizeInPixels.height);

        if (cx !== 0) {
          this.p.push();
          {
            this.p.fill("white");
            this.p.textAlign(this.p.CENTER);
            this.p.strokeWeight(1);
            this.p.text(cx, x - this.config.cellSize.width / 2, -5);
            this.p.text(
              cx,
              x - this.config.cellSize.width / 2,
              this.config.gridSizeInPixels.height + 15
            );
          }
          this.p.pop();
        }
      }

      // horizontal lines
      for (let cy = 0; cy <= this.config.gridSizeInCells.height; cy++) {
        const y = cy * this.config.cellSize.height;
        this.p.line(0, y, this.config.gridSizeInPixels.width, y);

        if (cy !== 0) {
          this.p.push();
          {
            this.p.fill("white");
            this.p.textAlign(this.p.RIGHT);
            this.p.strokeWeight(1);
            this.p.text(cy, -5, y - this.config.cellSize.height / 2 + 5);
            this.p.textAlign(this.p.LEFT);
            this.p.text(
              cy,
              this.config.gridSizeInPixels.width + 5,
              y - this.config.cellSize.height / 2 + 5
            );
          }
          this.p.pop();
        }
      }
    }
    this.p.pop();
  }

  getCanvasRectangleFromCell(cell: p5.Vector) {
    const tl = new p5.Vector(
      (cell.x - 1) * this.config.cellSize.width + this.config.origin.x,
      (cell.y - 1) * this.config.cellSize.height + this.config.origin.y
    );
    const br = new p5.Vector(
      cell.x * this.config.cellSize.width + this.config.origin.x,
      cell.y * this.config.cellSize.height + this.config.origin.y
    );
    return new Rectangle(tl, br);
  }

  getCanvasRectangleFromVertexCells(rect: IRectangle) {
    const canvasTopLeft = this.getCanvasRectangleFromCell(rect.topLeft).topLeft;
    const canvasBottomRight = this.getCanvasRectangleFromCell(
      rect.bottomRight
    ).bottomRight;
    return new Rectangle(canvasTopLeft, canvasBottomRight);
  }
}
