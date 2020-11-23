import { expect } from "chai";
import { DomainEvent } from "../src/domain/events";
import { Command } from "../src/domain/commands";
import { CommandHandler } from "../src/infrastructure/command_handlers";

type Publish = (event: DomainEvent) => void;
type HandlerFactory<T> = (history: DomainEvent[], publish: Publish) => CommandHandler<T>

export interface Framework<T extends Command> {
  readonly given: (events: DomainEvent[]) => void;
  readonly when: (command: T) => void
  readonly thenExpect: (events: DomainEvent[]) => void
}

export type FrameworkFactory = <T extends Command>(handlerFactory: HandlerFactory<T>) => Framework<T>
export const createFramework: FrameworkFactory = <T>(handlerFactory: HandlerFactory<T>) => {
  let history: DomainEvent[] = [];
  const publishedEvents: DomainEvent[] = [];

  return {
    given: (events: DomainEvent[]): void => {
      history = events
    },
    when: (command: T): void => {
      const handler = handlerFactory(history, (event) => {
        publishedEvents.push(event)
      })
      handler.handleCommand(command)
    },
    thenExpect(events: DomainEvent[]) {
      expect(publishedEvents).to.be.eql(events)
    }
  }
}