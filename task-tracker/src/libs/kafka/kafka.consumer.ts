import { Consumer, ConsumerSubscribeTopic } from 'kafkajs';
import { IKafkaConsumer } from './kafka.interface';
import { logger } from '../../utils/logger';
import { UserService } from '../../resources/users/user.service';
import { UserRepository } from '../../resources/users/user.repository';
import { userHandler } from './handlers/user.handler';

// Test implementation
// TODO refactor
const userRepository = new UserRepository();
const userService = new UserService(userRepository);

export class KafkaConsumer implements IKafkaConsumer {
  protected consumer: Consumer;
  private handlers = new Map([['users', userHandler]]);

  public constructor(consumer: Consumer) {
    this.consumer = consumer;
  }

  public async subscribe(topic: ConsumerSubscribeTopic): Promise<void> {
    await this.consumer.connect();
    await this.consumer.subscribe(topic);
  }

  public async receiveMessages(handler: string): Promise<void> {
    await this.consumer.run({
      eachMessage: async ({ message }) => {
        try {
          const messageHandler = this.handlers.get(handler);
          await messageHandler(userService, message);

          // const event = {
          //   key: message.key.toString(),
          //   value: message.value.toString(),
          //   headers: message.headers,
          // };
          // console.log(event);
          // logger.info(JSON.stringify(event));
        } catch (error) {
          logger.error(error);
          throw error;
        }
      },
    });
  }
}
