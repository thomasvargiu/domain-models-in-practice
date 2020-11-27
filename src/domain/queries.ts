// Query
export interface Query { }

export class GetAvailableSeats implements Query {
  readonly screenId: string

  constructor(screenId: string) {
    this.screenId = screenId
  }
}