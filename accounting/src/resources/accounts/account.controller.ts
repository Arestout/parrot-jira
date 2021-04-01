import { NextFunction, Request, Response } from 'express';
import { CreateUserDto } from './user.dto';
import { UserDto } from './interfaces/user.interface';
import { AccountService } from './account.service';
import { AccountRepository } from './account.repository';
import { KafkaProducer } from '../../libs/kafka/kafka.producer';
import { TaskRepository } from '../tasks/task.repository';

const accountRepository = new AccountRepository();
const taskRepository = new TaskRepository();
const kafkaProducer = new KafkaProducer();
export class AccountController {
  public accountService = new AccountService(accountRepository, kafkaProducer, taskRepository);

  public getDailyData = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const dailyData = await this.accountService.getDailyData();

      res.status(200).json(dailyData);
    } catch (error) {
      next(error);
    }
  };
}
