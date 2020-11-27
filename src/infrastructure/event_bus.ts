import { DomainEvent } from "../domain/events"

export class EventBus {
  private events: DomainEvent[] = []

  publish(event: DomainEvent): void {
    this.events.push(event)
  }

  getPublishedEvents(): DomainEvent[] {
    return this.events;
  }
}
