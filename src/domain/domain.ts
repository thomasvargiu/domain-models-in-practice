import { DomainEvent, ScreenScheduled, SeatReserved, SeatReservationRefused } from "./events"

export enum Row {
  A,
  B,
  C,
  D,
}

export enum Col {
  ONE,
  TWO,
  THREE,
  FOUR,
}

// Value Object
export class Seat {
  private readonly row: Row
  private readonly col: Col

  constructor(row: Row, col: Col) {
    this.row = row
    this.col = col
  }

  equals(obj: Seat): boolean {
    return this.row === obj.row && this.col === obj.col
  }

  toString() {
    return `${this.row}-${this.col}`
  }
}
export class CustomerId {
  private readonly id: string

  constructor(id: string) {
    this.id = id
  }

  value(): string {
    return this.id;
  }
}
export class Screen {
  readonly screenId: ScreenId;
  readonly startTime: Date;

  constructor(screenId: ScreenId, startTime: Date) {
    this.screenId = screenId;
    this.startTime = startTime
  }
}
export class ScreenId {
  private readonly id: string

  constructor(id: string) {
    this.id = id
  }

  value(): string {
    return this.id;
  }

  equals(obj: ScreenId): boolean {
    return this.id === obj.id
  }
}

// Aggregate state
export class ReservationState {
  reservedSeat: Seat[] = []
  screen: Screen | undefined

  constructor(events: DomainEvent[]) {
    for (const event of events) {
      this.apply(event)
    }
  }

  apply(event: DomainEvent) {
    if (event instanceof ScreenScheduled) {
      this.screen = new Screen(event.screenId, event.startTime)
    }

    if (event instanceof SeatReserved) {
      this.reservedSeat.push(event.seat)
    }
  }
}

// Aggregate
export class Reservation {
  reservationState: ReservationState
  publish: (event: Object) => void

  constructor(reservationState: ReservationState, publish: (event: Object) => void) {
    this.reservationState = reservationState
    this.publish = publish
  }

  isOnTime() {
    let screen = this.reservationState.screen;
    return screen && screen.startTime > new Date((new Date()).getTime() - (15 * 60 * 1000));
  }

  isAvailable(seat: Seat) {
    return !this.reservationState.reservedSeat.find((s) => s.equals(seat))
  }

  canBook(seat: Seat) {
    return this.isOnTime() && this.isAvailable(seat);
  }

  reserveSeat(customerId: CustomerId, screenId: ScreenId, seat: Seat) {
    if (this.canBook(seat)) this.publish(new SeatReserved(customerId, screenId, seat))
    else this.publish(new SeatReservationRefused(customerId, screenId, seat))
  }
}
