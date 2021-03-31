import { Consumer, ConsumerSubscribeTopic } from 'kafkajs';
import { IKafkaConsumer } from './kafka.interface';
import { logger } from '../../utils/logger';
import { userHandler } from './handlers/user.handler';
import { taskHandler } from './handlers/task.handler';
import { registry } from './kafka.config';

// Test implementation
// TODO refactor

export class KafkaConsumer implements IKafkaConsumer {
  protected consumer: Consumer;
  private connectionPromise: Promise<void> | null;
  private handlers = new Map<string, any>([
    ['user-topic', userHandler],
    ['task-topic', taskHandler],
  ]);

  public constructor(consumer: Consumer) {
    this.consumer = consumer;
    this.connectionPromise = null;
  }

  private async connect() {
    if (!this.connectionPromise) {
      this.connectionPromise = this.consumer.connect();
    }

    return this.connectionPromise;
  }

  public async subscribe(data: ConsumerSubscribeTopic): Promise<void> {
    await this.connect();
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
