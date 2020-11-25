import { Query, GetAvailableSeats } from "../domain/queries"
import { AvailableSeatsByScreen, GetAvailableSeatsResponse, ScreenId } from "../domain/domain"
import { EventStore } from "./event_store"

// Query Handler
export interface QueryHandler<T extends Query> {
  handleQuery(query: T): void;
}


export class GetAvailableSeatsHandler implements QueryHandler<GetAvailableSeats> {
  private eventStore: EventStore
  private respond: (response: Object) => void

  constructor(eventStore: EventStore, respond: (response: Object) => void) {
    this.eventStore = eventStore
    this.respond = respond
  }

  handleQuery(query: GetAvailableSeats): void {
    const screenId = new ScreenId(query.screenId)
  
    const events = this.eventStore.byScreenId(screenId)

    const readModel = new AvailableSeatsByScreen(events)

    this.respond(
      new GetAvailableSeatsResponse(screenId, 
        readModel.availableSeats.get(screenId)))
  }
}