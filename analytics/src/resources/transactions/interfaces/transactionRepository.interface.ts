import { CreateTransaction, TransactionDto } from './transaction.interface';

export interface ITransactionRepository {
  all(): Promise<TransactionDto[]>;
  create(transactionData: CreateTransaction): Promise<TransactionDto>;
  getDailyTransactions(): Promise<TransactionDto[]>;
  getDailyDebitsSum(): Promise<number>;
}
