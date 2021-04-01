import { TransactionDto } from './../transactions/transaction.interface';

export interface IAccountRepository {
  addTransaction(userId: string, transactionDto: TransactionDto): Promise<TransactionDto>;
}
