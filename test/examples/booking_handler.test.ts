import { expect } from "chai"
import {
  ReserveSeat,
  ReserveSeatHandler,
  Row,
  Col,
  EventStore,
  SeatReserved,
  Seat,
  CustomerId,
  ScreenId,
  SeatReservationRefused,
  DomainEvent,
} from "../../src/seat"

describe("A Customer reserves specific seats at a specific screening (for simplicity, assume there exists only one screening for the time beeing)", () => {
  it("If available, the seats should be reserved.", async () => {
    const events: DomainEvent[] = []
    const eventStore = new EventStore([])
    const commandHandler = new ReserveSeatHandler(eventStore, (e) => events.push(e))
    const command = new ReserveSeat("customer1", "screen1", Row.A, Col.ONE)

    commandHandler.handleCommand(command)

    expect(events.length).eql(1)
    expect(events[0]).to.be.instanceOf(SeatReserved)
  })
  it("If not available, the seats should not be reserved.", async () => {
    const events: DomainEvent[] = []
    const eventStore = new EventStore([
      new SeatReserved(new CustomerId("customer1"), new ScreenId("screen1"), new Seat(Row.A, Col.ONE)),
    ])
    const commandHandler = new ReserveSeatHandler(eventStore, (e) => events.push(e))
    const command = new ReserveSeat("customer2", "screen1", Row.A, Col.ONE)

    commandHandler.handleCommand(command)

    expect(events.length).eql(1)
    expect(events[0]).to.be.instanceOf(SeatReservationRefused)
  })
})
