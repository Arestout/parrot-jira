import { NextFunction, Request, Response } from 'express';
import { AccountService } from './account.service';
import { AccountRepository } from './account.repository';
import { KafkaProducer } from '../../libs/kafka/kafka.producer';
import { TaskRepository } from '../tasks/task.repository';
import { TransactionRepository } from '../transactions/transaction.repository';

const accountRepository = new AccountRepository();
const transactionRepository = new TransactionRepository();
const taskRepository = new TaskRepository();
const kafkaProducer = new KafkaProducer();
export class AccountController {
  public accountService = new AccountService(accountRepository, transactionRepository, kafkaProducer, taskRepository);

  public getDailyData = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const dailyData = await this.accountService.getDailyData();

      res.status(200).json(dailyData);
    } catch (error) {
      next(error);
    }
  };
}
