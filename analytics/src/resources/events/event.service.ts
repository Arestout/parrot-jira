import { IEventRepository } from './interfaces/eventRepository.interface';
import { EventDto } from './interfaces/event.interface';
import { Message } from 'kafkajs';

export class EventService {
  public eventRepository: IEventRepository;

  constructor(eventRepository: IEventRepository) {
    this.eventRepository = eventRepository;
  }

  public async create(eventMessage: Message): Promise<EventDto> {
    const headers = {};

    for (const [key, value] of Object.entries(eventMessage.headers)) {
      headers[key] = value.toString();
    }

    const event: EventDto = await this.eventRepository.create({ ...headers, message: JSON.stringify(eventMessage.value) });

    return event;
  }
}
