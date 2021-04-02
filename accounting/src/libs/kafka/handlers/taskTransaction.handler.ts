import { AccountRepository } from '../../../resources/accounts/account.repository';
import { TransactionRepository } from '../../../resources/transactions/transaction.repository';
import { TransactionService } from '../../../resources/transactions/transaction.service';
import { KafkaProducer } from '../kafka.producer';

const accountsRepository = new AccountRepository();
const transactionRepository = new TransactionRepository();
const kafkaProducer = new KafkaProducer();
const transactionService = new TransactionService(transactionRepository, accountsRepository, kafkaProducer);

export const taskTransactionHandler = async message => {
  const { event_version } = message.headers;

  if (event_version.toString() !== '1') {
    throw new Error('Unsupported version');
  }

  switch (message.key.toString()) {
    case 'TaskAssigned':
      return await transactionService.addTransaction('credit', message.value);
    case 'TaskCompleted':
      return await transactionService.addTransaction('debit', message.value);
    default:
      return;
  }
};
