import { ScreenId, Seat, CustomerId } from "./domain"

export interface DomainEvent { }

// Event
export class SeatReserved implements DomainEvent {
  readonly customerId: CustomerId
  readonly screenId: ScreenId
  readonly seat: Seat

  constructor(customerId: CustomerId, screenId: ScreenId, seat: Seat) {
    this.customerId = customerId
    this.screenId = screenId
    this.seat = seat
  }
}

export class SeatReservationRefused implements DomainEvent {
  readonly customerId: CustomerId
  readonly screenId: ScreenId
  readonly seat: Seat

  constructor(customerId: CustomerId, screenId: ScreenId, seat: Seat) {
    this.customerId = customerId
    this.screenId = screenId
    this.seat = seat
  }
}

export class ScreenScheduled implements DomainEvent {
  readonly screenId: ScreenId
  readonly startTime: Date
  readonly seats: Seat[]

  constructor(screenId: ScreenId, startTime: Date, seats: Seat[]) {
    this.screenId = screenId
    this.startTime = startTime
    this.seats = seats
  }
}