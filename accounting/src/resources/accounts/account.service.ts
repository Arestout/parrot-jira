import { v4 as uuidv4 } from 'uuid';

import { TransactionDto } from './transactions/transaction.interface';
import { IAccountRepository } from './interfaces/accountRepository.interface';
import { IKafkaProducer } from '../../libs/kafka/kafka.interface';
import { random } from '../../utils/random';
import { transactionSchema } from '../../libs/kafka/schemas/transaction.schema';
import { AccountDto } from './interfaces/account.interface';
import { ITaskRepository } from '../tasks/interfaces/taskRepository.interface';
import { TASK_STATUS_TOPIC } from './../../config/index';

export class AccountService {
  public accountRepository: IAccountRepository;
  public taskRepository: ITaskRepository;
  public kafkaProducer: IKafkaProducer;

  constructor(repository: IAccountRepository, kafkaProducer: IKafkaProducer, taskRepository: ITaskRepository) {
    this.accountRepository = repository;
    this.kafkaProducer = kafkaProducer;
    this.taskRepository = taskRepository;
  }

  public async all(): Promise<AccountDto[]> {
    const tasks: AccountDto[] = await this.accountRepository.all();

    return tasks;
  }

  public async addTransaction(type: string, data): Promise<TransactionDto> {
    const createTransaction = {
      task_id: data.id,
      debit: type === 'debit' ? random(10, 30) : 0,
      credit: type === 'credit' ? random(10, 30) : 0,
      type,
      description: data.description,
    };

    const transaction: TransactionDto = await this.accountRepository.addTransaction(data.user_id, createTransaction);
    const { id, debit, credit } = transaction;

    const encodedMessage = await this.kafkaProducer.encode(transactionSchema, { user_id: data.user_id, id, debit, credit });
    const event = {
      key: 'taskTransactionApplied',
      value: encodedMessage,
      headers: {
        event_id: uuidv4(),
        event_version: '1',
        event_name: 'taskTransactionApplied',
        event_time: Date.now().toString(),
        producer: 'accounting-service',
      },
    };
    await this.kafkaProducer.sendMessage(TASK_STATUS_TOPIC, [event]);

    return transaction;
  }

  public async updateBalance(user_id: string, currentBalance: number) {
    await this.accountRepository.update(user_id, { balance: currentBalance });

    const encodedMessage = await this.kafkaProducer.encode(transactionSchema, { amount: currentBalance, user_id });
    const event = {
      key: 'paymentSend',
      value: encodedMessage,
      headers: {
        event_id: uuidv4(),
        event_version: '1',
        event_name: 'paymentSend',
        event_time: Date.now().toString(),
        producer: 'accounting-service',
      },
    };
    await this.kafkaProducer.sendMessage(TASK_STATUS_TOPIC, [event]);
  }

  public async getDailyData() {
    const [tasksSum, getDailyDebits, getDailyTransactions] = await Promise.all([
      this.taskRepository.sum(),
      this.accountRepository.getDailyDebits(),
      this.accountRepository.getDailyTransactions(),
    ]);

    const managersProfit = (tasksSum + getDailyDebits) * -1;

    return { managersProfit, getDailyTransactions };
  }
}
