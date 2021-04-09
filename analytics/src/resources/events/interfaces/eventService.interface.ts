import { Message } from 'kafkajs';
import { EventDto } from './event.interface';

export interface IEventService {
  create(eventMessage: Message): Promise<EventDto>;
}
