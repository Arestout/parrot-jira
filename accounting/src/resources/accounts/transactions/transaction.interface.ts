export interface CreateTransaction {
  debit: number;
  credit: number;
}

export interface TransactionDto {
  id: string;
  account_id: string;
  debit: number;
  credit: number;
  task_id: string;
  createdAt?: Date;
}
