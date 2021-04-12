import { v4 as uuidv4 } from 'uuid';

import { TransactionDto } from './interfaces/transaction.interface';
import { IAccountRepository } from './../accounts/interfaces/accountRepository.interface';
import { IKafkaProducer } from '../../libs/kafka/kafka.interface';
import { random } from '../../utils/random';
import { transactionSchema } from '../../libs/kafka/schemas/transaction.schema';
import { ITransactionRepository } from './interfaces/transactionRepository.interface';
import { TASK_STATUS_TOPIC } from './../../config/index';
import { ITransactionService } from './interfaces/transactionService.interface';

export class TransactionService implements ITransactionService {
  public transactionRepository: ITransactionRepository;
  public accountRepository: IAccountRepository;
  public kafkaProducer: IKafkaProducer;

  constructor(transactionRepository: ITransactionRepository, accountRepository: IAccountRepository, kafkaProducer: IKafkaProducer) {
    this.transactionRepository = transactionRepository;
    this.accountRepository = accountRepository;
    this.kafkaProducer = kafkaProducer;
  }

  public async all(): Promise<TransactionDto[]> {
    const transactions: TransactionDto[] = await this.transactionRepository.all();

    return transactions;
  }

  public async create(type: string, data): Promise<TransactionDto> {
    const createTransaction = {
      task_id: data.id,
      debit: type === 'debit' ? random(10, 30) : 0,
      credit: type === 'credit' ? random(10, 30) : 0,
      type,
      description: data.description,
    };

    const transaction: TransactionDto = await this.transactionRepository.create(data.user_id, createTransaction);
    const { id, debit, credit, description } = transaction;

    const encodedMessage = await this.kafkaProducer.encode(transactionSchema, { user_id: data.user_id, id, debit, credit, type, description });
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

  public async getDailyTransactions(): Promise<TransactionDto[]> {
    const transactions: TransactionDto[] = await this.transactionRepository.getDailyTransactions();

    return transactions;
  }

  async getDailyDebitsSum(): Promise<number> {
    const dailyDebitSum = this.transactionRepository.getDailyDebitsSum();

    return dailyDebitSum;
  }
}
