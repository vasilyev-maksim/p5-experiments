type EventByType<
  Event extends { type: string },
  Type extends Event["type"],
> = Extract<Event, { type: Type }>;

export class EventBus<Event extends { type: string }> {
  private eventTarget = new EventTarget();

  on<Type extends Event["type"]>(
    type: Type,
    callback: (event: EventByType<Event, Type>) => void,
  ): EventListener {
    const cb = ((e: CustomEvent<EventByType<Event, Type>>) => {
      callback(e.detail);
    }) as EventListener;

    this.eventTarget.addEventListener(type, cb);
    return cb;
  }

  off(type: Event["type"], listener: EventListener): void {
    this.eventTarget.removeEventListener(type, listener);
  }

  emit(event: Event): void {
    this.eventTarget.dispatchEvent(
      new CustomEvent(event.type, { detail: event }),
    );
  }
}

const bus = new EventBus();

bus.on("export", (e) => {
  console.log(e); // ✅ TypeScript knows user has name & id
});
