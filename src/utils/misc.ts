import type { IParams } from "../models";

function serializeParams(params: IParams): string {
  return Object.entries(params)
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map((key, value) => key + "__" + value)
    .join("___");
}

export function areParamsEqual(a: IParams, b: IParams): boolean {
  return serializeParams(a) === serializeParams(b);
}

export function delay(delay: number) {
  return new Promise((r) => setTimeout(r, delay));
}

export function getClosestDiscreteValue(
  min: number,
  max: number,
  step: number,
  value: number,
): number {
  if (value >= max) {
    return max;
  } else if (value <= min) {
    return min;
  } else {
    let tmp = (value - min) / step;
    const remainder = tmp % 1;
    tmp = Math.floor(tmp);
    return min + (remainder < 0.5 ? tmp : tmp + 1) * step;
  }
}

export function checkExhaustiveness(x: never, message?: string): never {
  throw new Error(message ?? `Unreachable case reached: ${JSON.stringify(x)}`);
}

export function asyncWhile(
  condition: () => boolean,
  cb: () => Promise<unknown>,
  cleanup?: () => void,
) {
  const f = () => {
    if (condition()) {
      cb().then(f);
    } else {
      cleanup?.();
    }
  };

  f();
}

export function range(len: number, reversed = false): number[] {
  return Array.from({ length: len }).map((_, i) =>
    reversed ? len - 1 - i : i,
  );
}

export async function copyToClipboard(text: string) {
  try {
    await navigator.clipboard.writeText(text);
    console.log("Copied!", text);
  } catch (err) {
    console.error("Failed to copy:", err);
  }
}

export function copyPresetCodeToClipboard(params: IParams) {
  const name = prompt("Preset name:")?.trim();
  const code = JSON.stringify({ params, ...(name ? { name } : {}) }, null, 4);
  return copyToClipboard(code);
}
