import { CreateTransaction, TransactionDto } from './transaction.interface';

export interface ITransactionRepository {
  all(): Promise<TransactionDto[]>;
  addTransaction(user_id: string, transactionData: CreateTransaction): Promise<TransactionDto>;
  getDailyTransactions(): Promise<TransactionDto[]>;
  getDailyDebitsSum(): Promise<number>;
}
