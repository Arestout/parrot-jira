import { Message } from 'kafkajs';
import { IErrorService } from '../../../resources/errors/interfaces/errorService.interface';
import { ITransactionService } from '../../../resources/transactions/interfaces/transactionService.interface';
import { Handler } from './abstractHandler';

export class TransactionHandler extends Handler {
  private transactionService: ITransactionService;

  public constructor(transactionService: ITransactionService, errorService: IErrorService) {
    super(errorService);
    this.transactionService = transactionService;
  }

  public async consumeMessage(message: Message): Promise<void> {
    switch (message.key.toString()) {
      case 'TaskAssigned':
        if (!this.checkVersion('1', message)) {
          return this.createError(message);
        }
        await this.transactionService.create('credit', message.value);
        break;
      case 'TaskCompleted':
        if (!this.checkVersion('1', message)) {
          return this.createError(message);
        }
        await this.transactionService.create('debit', message.value);
        break;
      default:
        return;
    }
  }
}
