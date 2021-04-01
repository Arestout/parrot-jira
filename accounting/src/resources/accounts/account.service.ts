import { v4 as uuidv4 } from 'uuid';

import { TransactionDto } from './transactions/transaction.interface';
import { IAccountRepository } from './interfaces/accountRepository.interface';
import { IKafkaProducer } from '../../libs/kafka/kafka.interface';
import { random } from '../../utils/random';
import { taskAssignedTransactionSchema } from '../../libs/kafka/schemas/taskAssignTransactionApplied.schema';

export class AccountService {
  public accountRepository: IAccountRepository;
  public kafkaProducer: IKafkaProducer;

  constructor(repository: IAccountRepository, kafkaProducer: IKafkaProducer) {
    this.accountRepository = repository;
    this.kafkaProducer = kafkaProducer;
  }

  public async addTransaction(type: string, data): Promise<TransactionDto> {
    console.log('data: ', data);
    const createTransaction = {
      debit: type === 'debit' ? random(10, 30) : 0,
      credit: type === 'credit' ? random(10, 30) : 0,
    };

    const transaction: TransactionDto = await this.accountRepository.addTransaction(data.user_id, createTransaction);
    const { id, debit, credit } = transaction;

    const encodedMessage = await this.kafkaProducer.encode(taskAssignedTransactionSchema, { user_id: data.user_id, id, debit, credit });
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
    await this.kafkaProducer.sendMessage('task-assigned-topic', [event]);

    return transaction;
  }
}
