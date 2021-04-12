import { TransactionDto } from './transaction.interface';

export interface ITransactionService {
  all(): Promise<TransactionDto[]>;
  create(type: string, data): Promise<TransactionDto>;
  getDailyTransactions(): Promise<TransactionDto[]>;
  getDailyDebitsSum(): Promise<number>;
}
