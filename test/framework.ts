import { expect } from "chai";
import { DomainEvent } from "../src/domain/events";
import { Command } from "../src/domain/commands";
import { CommandHandler, ReserveSeatHandler } from "../src/infrastructure/command_handlers";
import { QueryHandler, GetAvailableSeatsHandler } from "../src/infrastructure/query_handlers";
import { EventStore } from "../src/infrastructure/event_store";
import { EventBus } from "../src/infrastructure/event_bus";
import { ReadModel, AvailableSeatsByScreen, QueryResponse } from "../src/domain/read_models";
import { Query } from "../src/domain/queries";

export interface Framework {
  readonly given: (events: DomainEvent[]) => void;
  readonly when: (command: Command) => void
  readonly whenQuery: (query: Query) => void
  readonly thenExpect: (events: DomainEvent[]) => void
  readonly thenExpectResponse: (responses: QueryResponse[]) => void
}

export class FrameworkFactory {

  static createFramework() : Framework {

    const eventStore: EventStore = new EventStore()
    const eventBus: EventBus = new EventBus()
    const readModels: ReadModel[] = []
    const commandHandlers: CommandHandler[] = []
    const queryHandlers: QueryHandler[] = []
    const queryResponses: QueryResponse[] = []


    return {  

      given(events: DomainEvent[]): void {
        eventStore.store(events)
        readModels.push(new AvailableSeatsByScreen(events))
      },

      when(command: Command): void {
        commandHandlers.push(new ReserveSeatHandler(eventStore, (event: DomainEvent) => {
            eventBus.publish(event)
            readModels.forEach(rm => rm.project(event))
          }
        ))

        commandHandlers.forEach(h => h.handleCommand(command))
      },

      whenQuery(query: Query): void {
        
        queryHandlers.push(new GetAvailableSeatsHandler(
          readModels.find(rm => rm instanceof AvailableSeatsByScreen) as AvailableSeatsByScreen, 
          (response) => { queryResponses.push(response) }))

        queryHandlers.forEach(h => h.handleQuery(query))
      },

      thenExpect(events: DomainEvent[]) {
        const publishedEvents = eventBus.getPublishedEvents()

        publishedEvents.forEach((publishedEvent, idx) => {
          expect(publishedEvent.constructor).to.be.eql(events[idx].constructor)  
          expect(publishedEvent).to.be.eql(events[idx])    
        })
      },

      thenExpectResponse(responses: QueryResponse[]) {
        
        queryResponses.forEach((queryResponse, idx) => {
          expect(queryResponse.constructor).to.be.eql(responses[idx].constructor)
          expect(queryResponse).to.be.eql(responses[idx])
        })
      }
    }
  }
}