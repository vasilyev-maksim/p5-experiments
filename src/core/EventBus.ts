import { Event } from "@/utils/Event";

type EventByType<
  Event extends { type: string },
  Type extends Event["type"],
> = Extract<Event, { type: Type }>;

export class EventBus<TEvent extends { type: string }> {
  private events = new Map<TEvent["type"], Event<TEvent>>();

  public addListener = <Type extends TEvent["type"]>(
    type: Type,
    callback: (event: EventByType<TEvent, Type>) => void,
  ): (() => void) => {
    let event = this.events.get(type);

    if (!event) {
      event = new Event<TEvent>();
      this.events.set(type, event);
    }

    return event.addListener(callback as (event: TEvent) => void);
  };

  public removeListener = <Type extends TEvent["type"]>(
    type: Type,
    callback: (event: EventByType<TEvent, Type>) => void,
  ): void => {
    this.events.get(type)?.removeListener(callback as (event: TEvent) => void);
  };

  public removeAllListeners = (): void => {
    for (const event of this.events.values()) {
      event.removeAllListeners();
    }
  };

  public dispatch = (event: TEvent): void => {
    this.events.get(event.type)?.dispatch(event);
  };
}
