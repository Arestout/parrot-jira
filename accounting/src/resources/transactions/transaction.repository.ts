import DB from '../../database/index';
import { isEmpty } from '../../utils/util';
import { ITransactionRepository } from './interfaces/transactionRepository.interface';
import { AccountDto } from '../accounts/interfaces/account.interface';
import { TransactionDto, CreateTransaction } from './interfaces/transaction.interface';

export class TransactionRepository implements ITransactionRepository {
  public accounts = DB.Accounts;
  public transactions = DB.Transactions;

  public async all(): Promise<TransactionDto[]> {
    const transactions: TransactionDto[] = await this.transactions.findAll();

    return transactions;
  }

  public async create(user_id: string, transactionData: CreateTransaction): Promise<TransactionDto> {
    const dbTransaction = await DB.sequelize.transaction();

    try {
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

      dbTransaction.commit();
      return transaction;
    } catch (error) {
      dbTransaction.rollback();
      throw error;
    }
  }

  public async getDailyTransactions(): Promise<TransactionDto[]> {
    const dayStart = new Date().setHours(0, 0, 0, 0);
    const dayEnd = new Date().setHours(23, 59, 59, 999);

    const dailyTransactions: TransactionDto[] = await this.transactions.findAll({
      where: {
        createdAt: {
          [DB.Sequelize.Op.gt]: dayStart,
          [DB.Sequelize.Op.lt]: dayEnd,
        },
      },
      include: [{ model: DB.Accounts, attributes: [] }],
      order: [[DB.Accounts, 'user_id', 'ASC']],
      attributes: {
        include: [[DB.Sequelize.col('user_id'), 'user_id']],
      },
    });

    return dailyTransactions;
  }

  public async getDailyDebitsSum(): Promise<number> {
    const dayStart = new Date().setHours(0, 0, 0, 0);
    const dayEnd = new Date().setHours(23, 59, 59, 999);

    const dailyDebitSum = await this.transactions.sum('debit', {
      where: {
        createdAt: {
          [DB.Sequelize.Op.gt]: dayStart,
          [DB.Sequelize.Op.lt]: dayEnd,
        },
      },
    });

    return dailyDebitSum;
  }
}
