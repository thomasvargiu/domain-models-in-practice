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
  ScreenRepository,
  Screen,
} from "../../src/seat"

/*
class TestFramework {
    private history: EventStore = new EventStore()
    private publishedEvents: DomainEvent[] = [];

    given(events: EventStore) {
        this.history = events;
    }

    when(command: Object) {
        const screenRepository = new ScreenRepository();
        const handler = new ReserveSeatHandler(
            this.history,
            new ScreenRepository(),
            function (event: Object) {

            }
        );
    }
}
*/


describe("A Customer reserves specific seats at a specific screening (for simplicity, assume there exists only one screening for the time beeing)", () => {
  it("If available, the seats should be reserved.", async () => {
    const events: DomainEvent[] = []
    const eventStore = new EventStore([])
      const screenId = new ScreenId("screen1")
      const screenStartTime = new Date((new Date()).getTime() + (20 * 60 * 1000));
      const screen = new Screen(screenId, screenStartTime);
      const screenRepository = new ScreenRepository(screen);
      const commandHandler = new ReserveSeatHandler(eventStore, screenRepository, (e) => events.push(e))
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
    const screenId = new ScreenId("screen1")
      const screenStartTime = new Date((new Date()).getTime() + (20 * 60 * 1000));
      const screen = new Screen(screenId, screenStartTime);
      const screenRepository = new ScreenRepository(screen);
    const commandHandler = new ReserveSeatHandler(eventStore, screenRepository, (e) => events.push(e))
    const command = new ReserveSeat("customer2", "screen1", Row.A, Col.ONE)

    commandHandler.handleCommand(command)

    expect(events.length).eql(1)
    expect(events[0]).to.be.instanceOf(SeatReservationRefused)
  })

  it("If not available, but too late.", async () => {
    const events: DomainEvent[] = []
    const eventStore = new EventStore([])
      const screenId = new ScreenId("screen1")
      const screenStartTime = new Date((new Date()).getTime() + (14 * 60 * 1000));
      const screen = new Screen(screenId, screenStartTime);
      const screenRepository = new ScreenRepository(screen);
    const commandHandler = new ReserveSeatHandler(eventStore, screenRepository, (e) => events.push(e))
    const command = new ReserveSeat("customer2", "screen1", Row.A, Col.ONE)

    commandHandler.handleCommand(command)

    expect(events.length).eql(1)
      expect(events[0]).to.be.instanceOf(SeatReservationRefused)
  })
})
