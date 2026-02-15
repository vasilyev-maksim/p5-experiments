import type { SketchEvent } from "@/models";

type SketchEventByType<K extends SketchEvent["type"]> = Extract<
  SketchEvent,
  { type: K }
>;

export class EventBus {
  private eventTarget = new EventTarget();

  on<T extends SketchEvent["type"]>(
    type: T,
    callback: (event: SketchEventByType<T>) => void,
  ): EventListener {
    const cb = ((e: CustomEvent<SketchEventByType<T>>) => {
      callback(e.detail);
    }) as EventListener;

    this.eventTarget.addEventListener(type, cb);
    return cb;
  }

  off(type: SketchEvent["type"], listener: EventListener): void {
    this.eventTarget.removeEventListener(type, listener);
  }

  emit(event: SketchEvent): void {
    this.eventTarget.dispatchEvent(
      new CustomEvent(event.type, { detail: event }),
    );
  }
}

const bus = new EventBus();

bus.on("export", (e) => {
  console.log(e); // ✅ TypeScript knows user has name & id
});
