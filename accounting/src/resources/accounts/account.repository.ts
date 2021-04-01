import HttpException from '../../utils/HttpException';
import DB from './../../database/index';
import { isEmpty } from '../../utils/util';
import { IAccountRepository } from './interfaces/accountRepository.interface';
import { AccountDto } from './interfaces/account.interface';
import { TransactionDto, CreateTransaction } from './transactions/transaction.interface';

export class AccountRepository implements IAccountRepository {
  public accounts = DB.Accounts;
  public transactions = DB.Transactions;

  public async addTransaction(user_id: string, transactionData: CreateTransaction): Promise<TransactionDto> {
    let account: AccountDto = await this.accounts.findOne({ where: { user_id }, plain: true });
    if (isEmpty(account)) {
      account = await this.accounts.create({ user_id, balance: 0 }).then(taskData => {
        return taskData.get({ plain: true });
      });
    }

    const transaction: TransactionDto = await this.transactions.create({ account_id: account.id, ...transactionData }).then(taskData => {
      return taskData.get({ plain: true });
    });

    const newBalance = account.balance + transaction.debit - transaction.credit;
    await this.accounts.update({ balance: newBalance }, { where: { id: account.id } });

    return transaction;
  }
}
