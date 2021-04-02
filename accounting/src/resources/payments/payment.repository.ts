import HttpException from '../../utils/HttpException';
import DB from './../../database/index';
import { isEmpty } from '../../utils/util';
import { PaymentDto, CreatePayment } from './interfaces/payment.interface';
import { AccountDto } from '../accounts/interfaces/account.interface';
import { IPaymentRepository } from './interfaces/paymentRepository.interface';

export class PaymentRepository implements IPaymentRepository {
  public payments = DB.Payments;
  public accounts = DB.Accounts;

  public async all(): Promise<PaymentDto[]> {
    const payments: PaymentDto[] = await this.payments.findAll();

    return payments;
  }

  public async find(id: string): Promise<PaymentDto> {
    const payment: PaymentDto = await this.payments.findOne({
      where: { id },
    });

    if (isEmpty(payment)) {
      throw new HttpException(404, 'Task was not found');
    }

    return payment;
  }

  public async addPaymentTransaction(paymentData: CreatePayment): Promise<PaymentDto> {
    const dbTransaction = await DB.sequelize.transaction();

    try {
      const account: AccountDto = await this.accounts.findOne({ where: { id: paymentData.account_id } });

      const paymentTransaction: PaymentDto = await this.payments.create({ account_id: account.id, ...paymentData }).then(taskData => {
        return taskData.get({ plain: true });
      });

      const newBalance = account.balance - paymentTransaction.debit + paymentTransaction.credit;
      await this.accounts.update({ balance: newBalance }, { where: { id: account.id } });

      dbTransaction.commit();
      return paymentTransaction;
    } catch (error) {
      dbTransaction.rollback();
      throw error;
    }
  }
}
