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
