import { TransactionDto } from './transaction.interface';

export interface ITransactionService {
  all(): Promise<TransactionDto[]>;
  create(transactionDto: TransactionDto): Promise<TransactionDto>;
  getDailyTransactions(): Promise<TransactionDto[]>;
  getDailyDebitsSum(): Promise<number>;
}
