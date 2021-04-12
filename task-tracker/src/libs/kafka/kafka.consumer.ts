import { Consumer, ConsumerSubscribeTopic } from 'kafkajs';
import { IKafkaConsumer } from './kafka.interface';
import { logger } from '../../utils/logger';
import { registry } from './kafka.config';
import { USER_TOPIC } from '../../config';
import { Handler } from './handlers/abstractHandler';
import { UserRepository } from '../../resources/users/user.repository';
import { UserService } from '../../resources/users/user.service';
import { UserHandler } from './handlers/user.handler';
import { ErrorRepository } from '../../resources/errors/error.repository';
import { ErrorService } from '../../resources/errors/error.service';

const errorRepository = new ErrorRepository();
const errorService = new ErrorService(errorRepository);

const userRepository = new UserRepository();
const userService = new UserService(userRepository);

const userHandler = new UserHandler(userService, errorService);

export class KafkaConsumer implements IKafkaConsumer {
  protected consumer: Consumer;
  private handlers = new Map<string, Handler>([[USER_TOPIC, userHandler]]);

  public constructor(consumer: Consumer) {
    this.consumer = consumer;
  }

  public async subscribe(data: ConsumerSubscribeTopic): Promise<void> {
    await this.consumer.connect();
    await this.consumer.subscribe(data);
  }

  public async receiveMessages(): Promise<void> {
    await this.consumer.run({
      eachMessage: async ({ topic, message }) => {
        try {
          const decodedMessage = {
            ...message,
            value: await registry.decode(message.value),
          };

          const messageHandler = this.handlers.get(topic);
          if (messageHandler) {
            await messageHandler.consumeMessage(decodedMessage);
          }
        } catch (error) {
          logger.error(error);
          throw error;
        }
      },
    });
  }
}
