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
    const raw = min + (remainder < 0.5 ? tmp : tmp + 1) * step;
    const precision = step.toString().split(".")[1]?.length ?? 0;
    return parseFloat(raw.toFixed(precision));
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

export function assert(
  condition: unknown,
  message?: string,
): asserts condition {
  if (!condition) {
    throw new Error(message ?? "Assertion failed");
  }
}

export function noop() {}
