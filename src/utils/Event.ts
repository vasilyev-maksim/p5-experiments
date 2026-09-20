export class Event<Arg = void> {
  private listeners: Array<(arg: Arg) => void> = [];

  public addListener = (callback: (arg: Arg) => void): (() => void) => {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter((x) => x !== callback);
    };
  };

  public removeListener = (callback: (arg: Arg) => void) => {
    this.listeners = this.listeners.filter((x) => x !== callback);
  };

  public removeAllListeners = () => {
    this.listeners = [];
  };

  public dispatch(arg: Arg): void {
    // some listener might add another listener to the end of queue,
    // that's why we use classic for-loop instead of `Array.forEach`
    for (let i = 0; i < this.listeners.length; i++) {
      this.listeners[i](arg);
    }
  }
}
