import { Consumer, ConsumerSubscribeTopic } from 'kafkajs';
import { IKafkaConsumer } from './kafka.interface';
import { logger } from '../../utils/logger';
import { userHandler } from './handlers/user.handler';
import { registry } from './kafka.config';

// Test implementation
// TODO refactor

export class KafkaConsumer implements IKafkaConsumer {
  protected consumer: Consumer;
  private handlers = new Map([['user-topic', userHandler]]);

  public constructor(consumer: Consumer) {
    this.consumer = consumer;
  }

  public async subscribe(data: ConsumerSubscribeTopic): Promise<void> {
    await this.consumer.connect();
    await this.consumer.subscribe(data);

    if (typeof data.topic === 'string') {
      await this.receiveMessages(data.topic);
    }
  }

  private async receiveMessages(topic: string): Promise<void> {
    await this.consumer.run({
      eachMessage: async ({ message }) => {
        try {
          const decodedMessage = {
            ...message,
            value: await registry.decode(message.value),
          };

          const messageHandler = this.handlers.get(topic);
          await messageHandler(decodedMessage);
        } catch (error) {
          // Maybe create Error topic ?
          logger.error(error);
          throw error;
        }
      },
    });
  }
}
