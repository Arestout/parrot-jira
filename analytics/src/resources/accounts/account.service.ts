import { IAccountRepository } from './interfaces/accountRepository.interface';
import { AccountDto } from './interfaces/account.interface';
import { ITaskRepository } from '../tasks/interfaces/taskRepository.interface';
import { ITransactionRepository } from '../transactions/interfaces/transactionRepository.interface';

export class AccountService {
  public accountRepository: IAccountRepository;
  public taskRepository: ITaskRepository;
  public transactionRepository: ITransactionRepository;

  constructor(accountRepository: IAccountRepository, transactionRepository: ITransactionRepository, taskRepository: ITaskRepository) {
    this.accountRepository = accountRepository;
    this.transactionRepository = transactionRepository;
    this.taskRepository = taskRepository;
  }
  public async all(): Promise<AccountDto[]> {
    const tasks: AccountDto[] = await this.accountRepository.all();

    return tasks;
  }

  public async getDailyData() {
    const [tasksSum, getDailyDebits, developersWithNegativeBalance] = await Promise.all([
      this.taskRepository.sum(),
      this.transactionRepository.getDailyDebitsSum(),
      this.accountRepository.getDevelopersWithNegativeBalance(),
    ]);

    const managersProfit = (tasksSum + getDailyDebits) * -1;

    return { managersProfit, developersWithNegativeBalance };
  }
}
