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
  ScreenScheduled,
  Screen,
} from "../../src/seat"
import { createFramework } from "../framework"

const framework = () => createFramework(
  (history, publish) => new ReserveSeatHandler(new EventStore(history), publish)
)

const createScreen = (screenId: string, startTime: Date): Screen => new ScreenScheduled(new ScreenId(screenId), startTime)

describe("A Customer reserves specific seats at a specific screening (for simplicity, assume there exists only one screening for the time beeing)", () => {
  it("If available, the seats should be reserved.", async () => {
    const screenStartTime = new Date((new Date()).getTime() + (20 * 60 * 1000));
    const screen = createScreen('screen1', screenStartTime)
    const { given, when, thenExpect } = framework()

    given([])
    when(new ReserveSeat('customer1', 'screen1', Row.A, Col.ONE))
    thenExpect([
      new SeatReserved(new CustomerId('customer1'), screen.screenId, new Seat(Row.A, Col.ONE))
    ])
  })

  it("If not available, the seats should not be reserved.", async () => {
    const screenStartTime = new Date((new Date()).getTime() + (20 * 60 * 1000));
    const screen = createScreen('screen1', screenStartTime)
    const { given, when, thenExpect } = framework()

    given([
      new SeatReserved(new CustomerId("customer1"), screen.screenId, new Seat(Row.A, Col.ONE))
    ])
    when(new ReserveSeat("customer2", "screen1", Row.A, Col.ONE))
    thenExpect([
      new SeatReservationRefused(new CustomerId('customer2'), screen.screenId, new Seat(Row.A, Col.ONE))
    ])
  })

  it("If available, but too late comparing screen start time.", async () => {
    const screenStartTime = new Date((new Date()).getTime() + (14 * 60 * 1000));
    const screen = createScreen('screen1', screenStartTime)
    const { given, when, thenExpect } = framework()

    given([])
    when(new ReserveSeat("customer1", "screen1", Row.A, Col.ONE))
    thenExpect([
      new SeatReservationRefused(new CustomerId('customer1'), screen.screenId, new Seat(Row.A, Col.ONE))
    ])
  })
})
