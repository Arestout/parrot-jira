import { TransactionDto } from '../../transactions/interfaces/transaction.interface';
import { AccountDto } from './account.interface';

export interface IAccountRepository {
  all(): Promise<AccountDto[]>;
  update(user_id: string, accountData: Partial<AccountDto>): Promise<AccountDto>;
  getDevelopersWithNegativeBalance(): Promise<AccountDto[]>;
}
