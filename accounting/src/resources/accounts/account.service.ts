import { v4 as uuidv4 } from 'uuid';

import { IAccountRepository } from './interfaces/accountRepository.interface';
import { IKafkaProducer } from '../../libs/kafka/kafka.interface';
import { transactionSchema } from '../../libs/kafka/schemas/transaction.schema';
import { AccountDto } from './interfaces/account.interface';
import { ITaskRepository } from '../tasks/interfaces/taskRepository.interface';
import { TASK_STATUS_TOPIC } from './../../config/index';
import { ITransactionRepository } from '../transactions/interfaces/transactionRepository.interface';

export class AccountService {
  public accountRepository: IAccountRepository;
  public taskRepository: ITaskRepository;
  public transactionRepository: ITransactionRepository;
  public kafkaProducer: IKafkaProducer;

  constructor(
    accountRepository: IAccountRepository,
    transactionRepository: ITransactionRepository,
    kafkaProducer: IKafkaProducer,
    taskRepository: ITaskRepository,
  ) {
    this.accountRepository = accountRepository;
    this.transactionRepository = transactionRepository;
    this.kafkaProducer = kafkaProducer;
    this.taskRepository = taskRepository;
  }

  public async all(): Promise<AccountDto[]> {
    const tasks: AccountDto[] = await this.accountRepository.all();

    return tasks;
  }

  public async getDailyData() {
    const [tasksSum, getDailyDebits, getDailyTransactions] = await Promise.all([
      this.taskRepository.sum(),
      this.transactionRepository.getDailyDebitsSum(),
      this.transactionRepository.getDailyTransactions(),
    ]);

    const managersProfit = (tasksSum + getDailyDebits) * -1;

    return { managersProfit, getDailyTransactions };
  }
}
