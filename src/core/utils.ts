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
  speed,
  time,
}: {
  p: p5;
  start: number;
  end: number;
  speed: number;
  time: number;
}): number {
  return p.map(p.sin(time * speed), -1, 1, start, end);
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
