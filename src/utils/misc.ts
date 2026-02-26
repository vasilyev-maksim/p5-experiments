/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  type ControlValueType,
  type IControl,
  type IControls,
  type IParams,
} from "../models";

function serializeParams(params: IParams): string {
  return Object.entries(params)
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map((key, value) => key + "__" + value)
    .join("___");
}

export function areParamsEqual(a: IParams, b: IParams): boolean {
  return serializeParams(a) === serializeParams(b);
}

function getRandomValueFromControl(c: IControl): ControlValueType<typeof c> {
  switch (c.type) {
    case "boolean":
      return Math.round(Math.random());
    case "choice":
      return Math.round(Math.random() * (c.options.length - 1));
    case "color":
      return Math.round(Math.random() * (c.colors.length - 1));
    case "range":
      return (
        Math.floor((Math.random() * (c.max - c.min)) / c.step) * c.step + c.min
      );
    case "coordinates":
      return [Math.random(), Math.random()];
  }
}

export function getRandomParams<Controls extends IControls>(
  controls: Controls,
): IParams<Controls> {
  return Object.entries<IControl>(controls).reduce((acc, [key, val]) => {
    return { ...acc, [key]: getRandomValueFromControl(val) };
  }, {}) as IParams<Controls>;
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
  const code =
    JSON.stringify({ params, ...(name ? { name } : {}) }, null, 4) + ",";
  return copyToClipboard(code);
}

export function tryParseNumber(str: string, fallback: number) {
  const num = Number(str);
  return isNaN(num) ? fallback : num;
}

export function chunkArray<T>(arr: T[], chunkLength: number): T[][] {
  const res = [];
  const a = [...arr];
  let i = 0;

  while (i < arr.length) {
    res.push(a.splice(0, chunkLength));
    i += chunkLength;
  }

  return res;
}

