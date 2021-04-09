import { Subscriber } from '../subscriber.interface';
import { INotificationMessage } from './message.interface';

export class SlackSubscriber implements Subscriber {
  public name = 'SlackSubscriber';

  public async notify(messageData: INotificationMessage): Promise<void> {
    const { public_id, slack } = messageData.user;
    console.log(`User with id ${public_id} was notified via Slack to number ${slack}. Message: ${messageData.message}`);
  }
}
