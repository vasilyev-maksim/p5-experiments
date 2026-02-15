import p5 from "p5";

export function getQsParam(key: string, defaultValue: string): string {
  return new URLSearchParams(window.location.search).get(key) ?? defaultValue;
}

export function easeInOutQuad(x: number): number {
  return x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2;
}

export function oscillateBetween({
  p,
  start,
  end,
  timeMultiplier,
  time,
  timeFunc,
}: {
  p: p5;
  start: number;
  end: number;
  timeMultiplier: number;
  time: number;
  timeFunc?: (x: number) => number;
}): number {
  const y = (timeFunc ?? ((x) => p.sin(x)))(time * timeMultiplier);
  return p.map(y, -1, 1, start, end);
}

export function periodic(fn: (x: number) => number): (x: number) => number {
  return (x) => {
    const rx = ((x + 1) % 2) - 1;
    return fn(rx);
  };
}

type Pieces = [func: (x: number) => number, start: number, end: number][];

export function piecewise(
  p: p5,
  pieces: Pieces, // x = [-1...1];
): (x: number) => number {
  // x = [-1...1];
  return (x) => {
    if (p.abs(x) > 1) {
      throw new Error("|x| should be <= 1");
    }

    const piece = pieces.find(([_, start, end]) => x >= start && x <= end);

    if (piece) {
      const [func, start, end] = piece;
      const rx = p.map(x, start, end, -1, 1, true);
      const y = func(rx);
      return y;
    } else {
      throw new Error(`piece not found for x = (${x})`);
    }
  };
}

export function flatSin(
  p: p5,
  outerOffset: number,
  middleOffset: number,
  innerOffset: number,
) {
  return periodic(
    piecewise(p, [
      [() => -1, -1, outerOffset - 1],
      ...(middleOffset === 0
        ? ([
            [(x) => p.sin(x * p.HALF_PI), outerOffset - 1, -innerOffset],
          ] satisfies Pieces)
        : ([
            [
              (x) => p.sin(x * p.HALF_PI) / 2 - 0.5,
              outerOffset - 1,
              -0.5 - middleOffset,
            ],
            [() => 0, -0.5 - middleOffset, -0.5 + middleOffset],
            [
              (x) => p.sin(x * p.HALF_PI) / 2 + 0.5,
              -0.5 + middleOffset,
              -innerOffset,
            ],
          ] satisfies Pieces)),
      [() => 1, -innerOffset, 0],
      [() => 1, 0, innerOffset],

      ...(middleOffset === 0
        ? ([
            [(x) => -p.sin(x * p.HALF_PI), innerOffset, 1 - outerOffset],
          ] satisfies Pieces)
        : ([
            [
              (x) => -p.sin(x * p.HALF_PI) / 2 + 0.5,
              innerOffset,
              0.5 - middleOffset,
            ],
            [() => 0, 0.5 - middleOffset, 0.5 + middleOffset],
            [
              (x) => -p.sin(x * p.HALF_PI) / 2 - 0.5,
              0.5 + middleOffset,
              1 - outerOffset,
            ],
          ] satisfies Pieces)),

      [() => -1, 1 - outerOffset, 1],
    ]),
  );
}

// export function oscillateBetween({
//   p,
//   start,
//   end,
//   speed,
//   time,
//   flatEdge = 0,
// }: {
//   p: p5;
//   start: number;
//   end: number;
//   speed: number;
//   time: number;
//   flatEdge?: number;
// }): number {
//   const sin = p.sin(time * speed);
//   if (sin < -1 + flatEdge) {
//     return start;
//   } else if (sin > 1 - flatEdge) {
//     return end;
//   } else {
//     const edge = (end - start) * flatEdge;
//     const _start = start + edge;
//     const _end = end - edge;
//     const val = p.map(
//       sin,
//       p.sin(-1 + flatEdge),
//       p.sin(1 - flatEdge),
//       _start,
//       _end,
//     );
//     return val;
//   }
// }
