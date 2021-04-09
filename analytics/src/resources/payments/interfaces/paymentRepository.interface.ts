import { PaymentDto, CreatePayment } from './payment.interface';

export interface IPaymentRepository {
  all(): Promise<PaymentDto[]>;
  find(id: string): Promise<PaymentDto>;
  addPaymentTransaction(paymentData: CreatePayment): Promise<PaymentDto>;
}
