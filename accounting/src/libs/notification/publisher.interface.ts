import { INotificationMessage } from './subscribers/message.interface';
import { Subscriber } from './subscriber.interface';

export interface Publisher {
  subscribe(subscriber: Subscriber): void;
  unsubscribe(subscriber: Subscriber): void;
  notify(message: INotificationMessage): Promise<void>;
}
