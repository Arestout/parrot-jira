import { TransactionDto } from './interfaces/transaction.interface';
import { IAccountRepository } from './../accounts/interfaces/accountRepository.interface';
import { ITransactionRepository } from './interfaces/transactionRepository.interface';

export class TransactionService {
  public transactionRepository: ITransactionRepository;
  public accountRepository: IAccountRepository;

  constructor(transactionRepository: ITransactionRepository, accountRepository: IAccountRepository) {
    this.transactionRepository = transactionRepository;
    this.accountRepository = accountRepository;
  }

  public async all(): Promise<TransactionDto[]> {
    const transactions: TransactionDto[] = await this.transactionRepository.all();

    return transactions;
  }

  public async create(transactionDto: TransactionDto): Promise<TransactionDto> {
    const transaction: TransactionDto = await this.transactionRepository.create(transactionDto);

    return transaction;
  }

  public async getDailyTransactions(): Promise<TransactionDto[]> {
    const transactions: TransactionDto[] = await this.transactionRepository.getDailyTransactions();

    return transactions;
  }

  async getDailyDebitsSum(): Promise<number> {
    const dailyDebitSum = this.transactionRepository.getDailyDebitsSum();

    return dailyDebitSum;
  }
}
