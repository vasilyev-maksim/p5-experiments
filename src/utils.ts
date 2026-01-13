import type { IParams } from "./models";

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
  value: number
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

export class Event<in out Arg = void> {
  private callbacks: Array<(arg: Arg) => void> = [];

  public addCallback = (callback: (arg: Arg) => void): (() => void) => {
    this.callbacks.push(callback);
    return () => {
      this.callbacks = this.callbacks.filter((x) => x !== callback);
    };
  };

  public __invokeCallbacks = (arg: Arg): void => {
    this.callbacks.forEach((cb) => cb(arg));
  };
}

export class Deferred<T = void> {
  promise: Promise<T>;
  resolve!: (value: T | PromiseLike<T>) => void;
  reject!: (reason?: unknown) => void;

  constructor() {
    this.promise = new Promise<T>((res, rej) => {
      this.resolve = res;
      this.reject = rej;
    });
  }
}

export function asyncWhile(
  condition: () => boolean,
  cb: () => Promise<unknown>,
  cleanup?: () => void
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

export class ValueWithHistory<T> {
  private static DEFAULT_COMPARATOR = <T>(a: T | undefined, b: T | undefined) =>
    a === b;
  private __value?: T;
  private __prev?: T;

  public set value(val: T) {
    this.__prev = this.__value;
    this.__value = val;
  }

  public get value(): T | undefined {
    return this.__value;
  }

  public get prev() {
    return this.__prev;
  }

  public get hasChanged() {
    return this.__comparator(this.__prev, this.__value) === false;
  }

  public constructor(
    initValue?: T,
    private readonly __comparator: (
      a: T | undefined,
      b: T | undefined
    ) => boolean = ValueWithHistory.DEFAULT_COMPARATOR
  ) {
    if (initValue) {
      this.__value = initValue;
    }
  }
}

export function range(len: number): number[] {
  return Array.from({ length: len }).map((_, i) => i);
}
