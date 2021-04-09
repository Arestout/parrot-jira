import DB from './../../database/index';
import { IEventRepository } from './interfaces/eventRepository.interface';
import { EventDto } from './interfaces/event.interface';

export class EventRepository implements IEventRepository {
  public events = DB.Events;

  public async create(eventDto: EventDto): Promise<EventDto> {
    const event: EventDto = await this.events.create(eventDto);

    return event;
  }
}
