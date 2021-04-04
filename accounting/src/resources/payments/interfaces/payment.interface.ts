export interface CreatePayment {
  debit: number;
  credit: number;
  description: string;
  account_id: string;
  user_id: string;
  type: string;
}

export interface PaymentDto extends CreatePayment {
  id: string;
  createdAt?: Date;
}
