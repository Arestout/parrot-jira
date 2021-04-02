import { v4 as uuidv4 } from 'uuid';

import { TransactionDto } from './interfaces/transaction.interface';
import { IAccountRepository } from './../accounts/interfaces/accountRepository.interface';
import { IKafkaProducer } from '../../libs/kafka/kafka.interface';
import { random } from '../../utils/random';
import { transactionSchema } from '../../libs/kafka/schemas/transaction.schema';
import { TASK_STATUS_TOPIC } from './../../config/index';
import { IPaymentRepository } from './interfaces/paymentRepository.interface';
import { CreatePayment, PaymentDto } from './interfaces/payment.interface';

export class PaymentService {
  public paymentRepository: IPaymentRepository;
  public accountRepository: IAccountRepository;
  public kafkaProducer: IKafkaProducer;

  constructor(paymentRepository: IPaymentRepository, accountRepository: IAccountRepository, kafkaProducer: IKafkaProducer) {
    this.paymentRepository = paymentRepository;
    this.accountRepository = accountRepository;
    this.kafkaProducer = kafkaProducer;
  }

  public async all(): Promise<PaymentDto[]> {
    const payment: PaymentDto[] = await this.paymentRepository.all();

    return payment;
  }

  public async find(id: string): Promise<PaymentDto> {
    const payment: PaymentDto = await this.paymentRepository.find(id);

    return payment;
  }

  public async addPaymentTransaction(paymentData: CreatePayment): Promise<PaymentDto> {
    const paymentTransaction: PaymentDto = await this.paymentRepository.addPaymentTransaction(paymentData);
    const { id, debit, credit, description } = paymentTransaction;

    const encodedMessage = await this.kafkaProducer.encode(transactionSchema, {
      id,
      user_id: paymentData.user_id,
      debit,
      credit,
      description,
    });
    const event = {
      key: 'paymentSend',
      value: encodedMessage,
      headers: {
        event_id: uuidv4(),
        event_version: '1',
        event_name: 'paymentSend',
        event_time: Date.now().toString(),
        producer: 'accounting-service',
      },
    };
    await this.kafkaProducer.sendMessage(TASK_STATUS_TOPIC, [event]);

    return paymentTransaction;
  }
}
