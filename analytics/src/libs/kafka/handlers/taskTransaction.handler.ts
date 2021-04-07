import { Message } from 'kafkajs';
import { AccountRepository } from '../../../resources/accounts/account.repository';
import { ErrorRepository } from '../../../resources/errors/error.repository';
import { ErrorService } from '../../../resources/errors/error.service';
import { TransactionRepository } from '../../../resources/transactions/transaction.repository';
import { TransactionService } from '../../../resources/transactions/transaction.service';

const accountsRepository = new AccountRepository();
const transactionRepository = new TransactionRepository();
const transactionService = new TransactionService(transactionRepository, accountsRepository);
const errorRepository = new ErrorRepository();
const errorService = new ErrorService(errorRepository);

export const taskTransactionHandler = async message => {
  const { event_version } = message.headers;

  const checkVersion = (version: string) => version === event_version.toString();

  const createError = async (message: Message) => {
    const error = await errorService.create(message);
    throw new Error(`Unsupported version. Error id: ${error.id}`);
  };

  switch (message.key.toString()) {
    case 'TaskAssigned':
      if (!checkVersion('1')) {
        return createError(message);
      }
      return await transactionService.create(message.value);
    case 'TaskCompleted':
      if (!checkVersion('1')) {
        return createError(message);
      }
      return await transactionService.create(message.value);
    default:
      return;
  }
};
