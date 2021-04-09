export interface CreateTransaction {
  debit: number;
  credit: number;
  task_id: string;
  type: string;
  description: string;
  user_id: string;
}

export interface TransactionDto extends CreateTransaction {
  id: string;
  account_id: string;
  createdAt?: Date;
}
