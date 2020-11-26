import { DomainEvent, ScreenScheduled, SeatReserved } from "./events"
import { ScreenId, Seat } from "./domain"

// Read Model
export interface ReadModel {
  project: (event: DomainEvent) => void
}

export class AvailableSeatsByScreen implements ReadModel {

  private availableSeats: Map<ScreenId, Seat[]> = new Map()

  constructor(events: DomainEvent[]) {
    for (const event of events) {
      this.apply(event)
    }
  }

  public project(event: DomainEvent) {
    this.apply(event)
  }

  private apply(event: DomainEvent) {
    if (event instanceof ScreenScheduled) {
      this.availableSeats.set(event.screenId, event.seats)
    }

    if (event instanceof SeatReserved) {
      const availableSeatsByScreen = this.availableSeats.get(event.screenId)!

      this.availableSeats.set(event.screenId,
        availableSeatsByScreen.filter(s => !s.equals(event.seat)))
    }
  }

  public getAvailableSeats(screenId: ScreenId): Seat[] {
    
    let seats: Seat[] = []

    this.availableSeats.forEach((v, k) => {
      if(k.equals(screenId)) {
        seats = v
      }
    })

    return seats
  }
}

export interface QueryResponse {
}

// DTO
export class GetAvailableSeatsResponse implements QueryResponse {

  public availableSeats: Seat[]
  public screenId: ScreenId

  constructor(screenId: ScreenId, availableSeats: Seat[]) {
    this.screenId = screenId
    this.availableSeats = availableSeats
  }
}


