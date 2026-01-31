export class Interval {
  private startTime?: number;

  public constructor(
    private interval?: number,
    private callback?: (tickNumber: number) => void,
    private initialTick: number = 0,
  ) {}

  public start(
    time: number,
    interval: number | undefined = this.interval,
    callback: ((tickNumber: number) => void) | undefined = this.callback,
    initialTick: number = this.initialTick,
  ) {
    this.interval = interval;
    this.startTime = time;
    this.callback = callback;
    this.initialTick = initialTick;
  }

  public clear() {
    this.callback = undefined;
    this.interval = undefined;
    this.initialTick = 0;
  }

  public reset(time: number) {
    this.startTime = time;
  }

  public tick(
    time: number,
    interval: number | undefined = this.interval,
    callback: ((tickNumber: number) => void) | undefined = this.callback,
    initialTick: number = this.initialTick,
  ) {
    if (
      this.startTime !== undefined &&
      interval !== undefined &&
      callback !== undefined
    ) {
      if ((time - this.startTime) % interval === 0) {
        const tickNUmber = initialTick + (time - this.startTime) / interval;
        callback(tickNUmber);
      }
    }
  }
}
