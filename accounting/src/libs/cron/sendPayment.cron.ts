import { AccountRepository } from '../../resources/accounts/account.repository';
import { AccountService } from '../../resources/accounts/account.service';
import { AccountDto } from '../../resources/accounts/interfaces/account.interface';
import { PaymentRepository } from '../../resources/payments/payment.repository';
import { PaymentService } from '../../resources/payments/payment.service';
import { TransactionRepository } from '../../resources/transactions/transaction.repository';
import { logger } from '../../utils/logger';
import { notificationQueue, paymentsQueue } from '../bull/bull.config';
import { KafkaProducer } from '../kafka/kafka.producer';

const kafkaProducer = new KafkaProducer();
const accountRepository = new AccountRepository();
const paymentRepository = new PaymentRepository();
const transactionRepository = new TransactionRepository();
const accountService = new AccountService(accountRepository, transactionRepository, kafkaProducer);
const paymentService = new PaymentService(paymentRepository, accountRepository, kafkaProducer);

export const sendPayment = async () => {
  try {
    const accounts: AccountDto[] = await accountService.all();

    for (const account of accounts) {
      if (account.balance > 0) {
        const paymentData = {
          account_id: account.id,
          user_id: account.user_id,
          debit: account.balance,
          credit: 0,
          type: 'debit',
          description: `Payment was made to ${account.user_id}`,
        };

        await paymentService.addPaymentTransaction(paymentData);
        await notificationQueue.add({
          user_id: paymentData.user_id,
          message: `You have received a payment. Amount: ${paymentData.debit}`,
        });
      }
    }
  } catch (error) {
    logger.error(error.message);
  }
};

paymentsQueue.add({}, { repeat: { cron: '0 17 * * *' } });
