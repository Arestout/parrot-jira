import DB from './../../database/index';
import { isEmpty } from '../../utils/util';
import { IAccountRepository } from './interfaces/accountRepository.interface';
import { AccountDto } from './interfaces/account.interface';

export class AccountRepository implements IAccountRepository {
  public accounts = DB.Accounts;
  public transactions = DB.Transactions;

  public async all(): Promise<AccountDto[]> {
    const accounts: AccountDto[] = await this.accounts.findAll();

    return accounts;
  }

  public async update(user_id: string, accountData: Partial<AccountDto>): Promise<AccountDto> {
    if (isEmpty(accountData)) throw new Error('Task data is empty');

    const transaction = await DB.sequelize.transaction();

    try {
      const findAccount: AccountDto = await this.accounts.findOne({ where: { user_id } });
      if (!findAccount) throw new Error('Account not found');

      await this.accounts.update(accountData, { where: { user_id } });

      await transaction.commit();
      return findAccount;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  public async getDevelopersWithNegativeBalance(): Promise<AccountDto[]> {
    const dayStart = new Date().setHours(0, 0, 0, 0);
    const dayEnd = new Date().setHours(23, 59, 59, 999);

    const accounts: AccountDto[] = await this.accounts.findAll({
      where: {
        createdAt: {
          [DB.Sequelize.Op.gt]: dayStart,
          [DB.Sequelize.Op.lt]: dayEnd,
        },
        balance: {
          [DB.Sequelize.Op.lt]: 0,
        },
      },
    });

    return accounts;
  }
}
