import { UserDto } from '../../resources/users/interfaces/user.interface';
import { UserRepository } from '../../resources/users/user.repository';
import { UserService } from '../../resources/users/user.service';
import { logger } from '../../utils/logger';
import { EmailSubscriber } from './subscribers/email.subscriber';
import { SlackSubscriber } from './subscribers/slack.subscriber';
import { SmsSubscriber } from './subscribers/sms.subscriber';
import { NotificationPublisher } from './notification.publisher';
import { INotificationJobData } from '../notification/subscribers/message.interface';

const userRepository = new UserRepository();
const userService = new UserService(userRepository);

const notification = new NotificationPublisher(logger);
notification.subscribe(new EmailSubscriber());
notification.subscribe(new SlackSubscriber());
notification.subscribe(new SmsSubscriber());

export const notificationQueueHandler = async (jobData: INotificationJobData) => {
  try {
    const user: UserDto = await userService.find(jobData.user_id);

    await notification.notify({ user, message: jobData.message });
  } catch (error) {
    logger.error(error.message);
  }
};
