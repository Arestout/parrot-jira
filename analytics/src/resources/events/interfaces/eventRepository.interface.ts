import { EventDto } from './event.interface';

export interface IEventRepository {
  create(errorDto: EventDto): Promise<EventDto>;
}
