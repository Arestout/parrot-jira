import { INotificationMessage } from './subscribers/message.interface';

export interface Subscriber {
  name: string;
  notify(message: INotificationMessage): Promise<void>;
}
