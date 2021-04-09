import { Subscriber } from '../subscriber.interface';
import { INotificationMessage } from './message.interface';

export class SmsSubscriber implements Subscriber {
  public name = 'SmsSubscriber';

  public async notify(messageData: INotificationMessage): Promise<void> {
    const { public_id, mobile } = messageData.user;
    console.log(`User with id ${public_id} was notified via SMS to number ${mobile}. Message: ${messageData.message}`);
  }
}
