import { TransactionDto } from './../transactions/transaction.interface';
import { AccountDto } from './account.interface';

export interface IAccountRepository {
  all(): Promise<AccountDto[]>;
  update(user_id: string, accountData: Partial<AccountDto>): Promise<AccountDto>;
  addTransaction(userId: string, transactionDto: TransactionDto): Promise<TransactionDto>;
  getDailyDebits(): Promise<number>;
  getDailyTransactions(): Promise<TransactionDto[]>;
}
