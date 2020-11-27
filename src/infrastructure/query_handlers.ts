import { Query, GetAvailableSeats } from "../domain/queries"
import { AvailableSeatsByScreen, GetAvailableSeatsResponse, QueryResponse } from "../domain/read_models"
import { ScreenId } from "../domain/domain"

// Query Handler
export interface QueryHandler {
  handleQuery(query: Query): void;
}


export class GetAvailableSeatsHandler implements QueryHandler {
  private readModel: AvailableSeatsByScreen
  private respond: (response: QueryResponse) => void

  constructor(readModel: AvailableSeatsByScreen, respond: (response: QueryResponse) => void) {
    this.readModel = readModel
    this.respond = respond
  }

  handleQuery(query: GetAvailableSeats): void {
    const screenId = new ScreenId(query.screenId)
    const queryResponse = new GetAvailableSeatsResponse(screenId,
      this.readModel.getAvailableSeats(screenId))

    this.respond(queryResponse)
  }
}