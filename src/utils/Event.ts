type EventListener<Arg> = {
  callback: (arg: Arg) => void;
  id?: string;
};

export class Event<Arg = void> {
  protected listeners: EventListener<Arg>[] = [];

  public addListener(callback: (arg: Arg) => void, id?: string): () => void {
    if (id !== undefined) {
      const foundIndex = this.listeners.findIndex((x) => x.id === id);

      if (foundIndex > -1) {
        this.listeners[foundIndex].callback = callback;
      } else {
        this.listeners.push({ callback, id });
      }
    } else {
      this.listeners.push({ callback });
    }

    return () => {
      this.removeListener(id ?? callback);
    };
  }

  public removeListener: {
    (callback: (arg: Arg) => void): void;
    (id: string): void;
    (callbackOrId: ((arg: Arg) => void) | string): void;
  } = (callbackOrId) => {
    const predicate: (x: EventListener<Arg>) => boolean =
      typeof callbackOrId === "string"
        ? ({ id }) => id !== callbackOrId
        : ({ callback }) => callback !== callbackOrId;

    this.listeners = this.listeners.filter(predicate);
  };

  public dispatch(arg: Arg): void {
    // some listener might add another listener to the end of queue,
    // that's why we use classic for-loop instead of `Array.forEach`
    for (let i = 0; i < this.listeners.length; i++) {
      this.listeners[i].callback(arg);
    }
  }

  // public __clearCallbacks = () => {
  //   this.callbacks = [];
  // };
}
