import { Worm2 } from "../Worm2";
import type { PatternArgs } from ".";

export function framePattern({ resY, p, resX }: PatternArgs): Worm2[] {
  const mid = Math.floor(resY / 2);
  const worms: Worm2[] = [];
  for (let y = 0; y < resY; y++) {
    let worm: Worm2;
    console.log(mid);

    let start = p.createVector(y < mid ? y : resY - y - 1, y);
    let end = p.createVector(y < mid ? resX - y - 1 : resX - resY + y, y);

    if (resY % 2 === 1 && y === mid) {
      start.add(p.createVector(-1, 0));
      end.add(p.createVector(1, 0));
    }

    if (y % 2 === 0) {
      [start, end] = [end, start];
    }

    worm = new Worm2({
      headDir: "right",
      head: start,
    });
    worm.go(end);

    worms.push(worm);
    // continue;

    if (y === resY || y === mid || y === mid - 1 || (resY % 2 && y === mid + 1))
      continue;

    start = p.createVector(
      y <= mid ? y : resX - resY + y,
      y <= mid ? y + 1 : resY - y,
    );
    end = p.createVector(
      y <= mid ? y : resX - resY + y,
      resY - (y <= mid ? y : resY - y - 1) - 2,
    );

    if (y % 2 === 0) {
      [start, end] = [end, start];
    }

    worm = new Worm2({
      headDir: "down",
      head: start,
    });
    worm.go(end);

    // worm = new Worm2({
    //   headDir: "left",
    //   head: p.createVector(resX - i, resY - (i - 1)),
    //   availablePositionsDict: matrix,
    // });
    // while (worm.grow("up"));
    // worms.push(worm);

    // worm = new Worm2({
    //   headDir: "down",
    //   head: p.createVector(i, i + 1),
    //   availablePositionsDict: matrix,
    // });
    // while (worm.grow("up"));
    // worms.push(worm);

    // worm = new Worm2({
    //   headDir: "up",
    //   head: p.createVector(resX - (i - 1), resY - (i - 1)),
    //   availablePositionsDict: matrix,
    // });
    // while (worm.grow("up"));
    worms.push(worm);
  }
  return worms;
}
