import { IAccountRepository } from './../accounts/interfaces/accountRepository.interface';
import { IPaymentRepository } from './interfaces/paymentRepository.interface';
import { CreatePayment, PaymentDto } from './interfaces/payment.interface';

export class PaymentService {
  public paymentRepository: IPaymentRepository;
  public accountRepository: IAccountRepository;

  constructor(paymentRepository: IPaymentRepository, accountRepository: IAccountRepository) {
    this.paymentRepository = paymentRepository;
    this.accountRepository = accountRepository;
  }

  public async all(): Promise<PaymentDto[]> {
    const payment: PaymentDto[] = await this.paymentRepository.all();

    return payment;
  }

  public async find(id: string): Promise<PaymentDto> {
    const payment: PaymentDto = await this.paymentRepository.find(id);

    return payment;
  }

  public async create(paymentData: CreatePayment): Promise<PaymentDto> {
    const paymentTransaction: PaymentDto = await this.paymentRepository.create(paymentData);

    return paymentTransaction;
  }
}
