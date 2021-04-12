import { Consumer, ConsumerSubscribeTopic } from 'kafkajs';
import { IKafkaConsumer } from './kafka.interface';
import { logger } from '../../utils/logger';
import { registry } from './kafka.config';
import { TASK_STATUS_TOPIC, TASK_TOPIC, USER_TOPIC } from '../../config';
import { TaskRepository } from '../../resources/tasks/task.repository';
import { TaskService } from '../../resources/tasks/task.service';
import { UserRepository } from '../../resources/users/user.repository';
import { UserService } from '../../resources/users/user.service';
import { AccountRepository } from '../../resources/accounts/account.repository';
import { TransactionRepository } from '../../resources/transactions/transaction.repository';
import { TransactionService } from '../../resources/transactions/transaction.service';
import { ErrorRepository } from '../../resources/errors/error.repository';
import { ErrorService } from '../../resources/errors/error.service';
import { TaskHandler } from './handlers/task.handler';
import { UserHandler } from './handlers/user.handler';
import { TransactionHandler } from './handlers/taskTransaction.handler';
import { Handler } from './handlers/abstractHandler';

const tasksRepository = new TaskRepository();
const taskService = new TaskService(tasksRepository);

const userRepository = new UserRepository();
const userService = new UserService(userRepository);

const accountRepository = new AccountRepository();
const transactionRepository = new TransactionRepository();
const transactionService = new TransactionService(transactionRepository, accountRepository);

const errorRepository = new ErrorRepository();
const errorService = new ErrorService(errorRepository);

const taskHandler = new TaskHandler(taskService, errorService);
const userHandler = new UserHandler(userService, errorService);
const taskTransactionHandler = new TransactionHandler(transactionService, errorService);

export class KafkaConsumer implements IKafkaConsumer {
  protected consumer: Consumer;
  private connectionPromise: Promise<void> | null;
  private handlers = new Map<string, Handler>([
    [USER_TOPIC, userHandler],
    [TASK_TOPIC, taskHandler],
    [TASK_STATUS_TOPIC, taskTransactionHandler],
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
