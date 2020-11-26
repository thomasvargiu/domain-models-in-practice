import {
  Row,
  Col,
  Seat,
  ScreenId,
  CustomerId,
} from "../src/domain/domain"

import {
  SeatReserved,
  SeatReservationRefused,
  ScreenScheduled
} from "../src/domain/events"

import {
  ReserveSeat
} from "../src/domain/commands"

import { Framework, FrameworkFactory } from "./framework"

describe("A Customer reserves specific seats at a specific screening", () => {

  let framework: Framework

  beforeEach(() => {
    framework = FrameworkFactory.createFramework()
  })

  it("If available, the seats should be reserved.", async () => {
    const screenStartTime = new Date((new Date()).getTime() + (20 * 60 * 1000));
    const screenId = new ScreenId('screen1')
    const { given, when, thenExpect } = framework

    given([
      new ScreenScheduled(screenId, screenStartTime, [new Seat(Row.A, Col.ONE)]),
    ])
    when(new ReserveSeat('customer1', screenId.value(), Row.A, Col.ONE))
    thenExpect([
      new SeatReserved(new CustomerId('customer1'), screenId, new Seat(Row.A, Col.ONE))
    ])
  })
  
  it("If not available, the seats should not be reserved.", async () => {
    const screenStartTime = new Date((new Date()).getTime() + (20 * 60 * 1000));
    const screenId = new ScreenId('screen1')
    const { given, when, thenExpect } = framework

    given([
      new ScreenScheduled(screenId, screenStartTime, [new Seat(Row.A, Col.ONE)]),
      new SeatReserved(new CustomerId("customer1"), screenId, new Seat(Row.A, Col.ONE))
    ])
    when(new ReserveSeat("customer2", screenId.value(), Row.A, Col.ONE))
    thenExpect([
      new SeatReservationRefused(new CustomerId('customer2'), screenId, new Seat(Row.A, Col.ONE))
    ])
  })

  it("If available but too late comparing to screen start time, the seats should not be reserved.", async () => {
    const screenStartTime = new Date((new Date()).getTime() + (14 * 60 * 1000));
    const screenId = new ScreenId('screen1')
    const { given, when, thenExpect } = framework

    given([
      new ScreenScheduled(screenId, screenStartTime, [new Seat(Row.A, Col.ONE)])
    ])
    when(new ReserveSeat("customer1", screenId.value(), Row.A, Col.ONE))
    thenExpect([
      new SeatReservationRefused(new CustomerId('customer1'), screenId, new Seat(Row.A, Col.ONE))
    ])
  })
})
