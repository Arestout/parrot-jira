import { Subscriber } from '../subscriber.interface';
import { INotificationMessage } from './message.interface';

export class EmailSubscriber implements Subscriber {
  public name = 'EmailSubscriber';

  public async notify(messageData: INotificationMessage): Promise<void> {
    const { public_id, email } = messageData.user;
    console.log(`User with id ${public_id} was notified via Email to ${email}. Message: ${messageData.message}`);
  }
}
