import { DomainEvent, ScreenScheduled, SeatReserved, SeatReservationRefused } from "../domain/events"
import { ScreenId } from "../domain/domain"

export class EventStore {
  events: DomainEvent[]

  constructor(events: DomainEvent[] = []) {
    this.events = events
  }

  byScreenId(screenId: ScreenId) {
    return this.events.filter(e =>
      (e instanceof ScreenScheduled && e.screenId.equals(screenId)) ||
      (e instanceof SeatReserved && e.screenId.equals(screenId)) ||
      (e instanceof SeatReservationRefused && e.screenId.equals(screenId)))
  }
}
