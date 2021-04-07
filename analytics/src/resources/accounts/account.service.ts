import { IAccountRepository } from './interfaces/accountRepository.interface';
import { AccountDto } from './interfaces/account.interface';

export class AccountService {
  public accountRepository: IAccountRepository;

  constructor(accountRepository: IAccountRepository) {
    this.accountRepository = accountRepository;
  }

  public async all(): Promise<AccountDto[]> {
    const tasks: AccountDto[] = await this.accountRepository.all();

    return tasks;
  }
}
