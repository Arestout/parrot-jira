import { Message } from 'kafkajs';
import { IErrorService } from '../../../resources/errors/interfaces/errorService.interface';
import { IEventService } from '../../../resources/events/interfaces/eventService.interface';
import { ITransactionService } from '../../../resources/transactions/interfaces/transactionService.interface';
import { Handler } from './abstractHandler';

export class TransactionHandler extends Handler {
  private transactionService: ITransactionService;
  private eventService: IEventService;

  public constructor(transactionService: ITransactionService, errorService: IErrorService, eventService: IEventService) {
    super(errorService);
    this.transactionService = transactionService;
    this.eventService = eventService;
  }

  public async consumeMessage(message: Message): Promise<void> {
    switch (message.key.toString()) {
      case 'TaskAssigned':
        if (!this.checkVersion('1', message)) {
          return this.createError(message);
        }
        await Promise.all([this.transactionService.create(message.value), this.eventService.create(message)]);
        break;
      case 'TaskCompleted':
        if (!this.checkVersion('1', message)) {
          return this.createError(message);
        }
        await Promise.all([this.transactionService.create(message.value), this.eventService.create(message)]);
        break;
      default:
        return;
    }
  }
}
