import p5 from "p5";

export function getQsParam(key: string, defaultValue: string): string {
  return new URLSearchParams(window.location.search).get(key) ?? defaultValue;
}

export function easeInOutQuad(x: number): number {
  return x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2;
}

export function oscillateBetween(
  p: p5,
  start: number,
  end: number,
  speed: number,
  time: number
): number {
  return p.map(p.sin(time * speed), -1, 1, start, end);
}
