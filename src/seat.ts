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
}
// Command
export class ReserveSeat {
  readonly customerId: string
  readonly screenId: string
  readonly row: Row
  readonly col: Col

  constructor(customerId: string, screenId: string, row: Row, col: Col) {
    this.customerId = customerId
    this.screenId = screenId
    this.row = row
    this.col = col
  }
}

export class EventStore {
  events: Object[]

  constructor(events: Object[] = []) {
    this.events = events
  }

  byScreenId(screenId: ScreenId) {
    return this.events
  }
}

export class ScreenRepository {
    readonly screen: Screen;
    constructor(screen: Screen) {
        this.screen = screen;
    }
    
    find(id: ScreenId) {
        return this.screen;
    }
}

// Command Handler
export class ReserveSeatHandler {
  private eventStore: EventStore
  private screenRepository: ScreenRepository;
  private publish: (event: Object) => void

  constructor(eventStore: EventStore, screenRepository: ScreenRepository, publish: (event: Object) => void) {
    this.eventStore = eventStore
    this.screenRepository = screenRepository
    this.publish = publish
  }

  handleCommand(reserveSeat: ReserveSeat) {
    const customerId = new CustomerId(reserveSeat.customerId)
    const screenId = new ScreenId(reserveSeat.screenId)
    const seat = new Seat(reserveSeat.row, reserveSeat.col)
    const screen = this.screenRepository.find(screenId)

    const events = this.eventStore.byScreenId(screenId)
    const reservationState = new ReservationState(events, screen)

    const reservation = new Reservation(reservationState, this.publish)

    reservation.reserveSeat(customerId, screenId, seat)

    return "OK"
  }
}

export interface DomainEvent {}

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

export class ReservationState {
  reservedSeat: Seat[] = []
  screen: Screen

  constructor(events: Object[], screen: Screen) {
    this.screen = screen
    for (const event of events) {
        this.apply(event as SeatReserved)
    }
  }

  apply(event: SeatReserved) {
    this.reservedSeat.push(event.seat)
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
        return this.reservationState.screen.startTime > new Date((new Date()).getTime() - (15 * 60 * 1000));
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
