import { NextFunction, Request, Response } from 'express';
import { TaskRepository } from './task.repository';
import { TaskService } from './task.service';
import { TaskDto } from './interfaces/task.interface';
import { CreateTaskDto } from './task.dto';
import { UserRepository } from '../users/user.repository';
import { KafkaProducer } from '../../libs/kafka/kafka.producer';
import jwt from 'jsonwebtoken';

const taskRepository = new TaskRepository();
const userRepository = new UserRepository();
const kafkaProducer = new KafkaProducer();
export class TaskController {
  private taskService = new TaskService(taskRepository, userRepository, kafkaProducer);

  public getAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const tasks: TaskDto[] = await this.taskService.all();

      res.status(200).json(tasks);
    } catch (error) {
      next(error);
    }
  };

  public getById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const task: TaskDto = await this.taskService.find(id);

      res.status(200).json(task);
    } catch (error) {
      next(error);
    }
  };

  public create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { body } = req;
      const task: CreateTaskDto = await this.taskService.create(body);

      res.status(200).json(task);
    } catch (error) {
      next(error);
    }
  };

  public complete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const headerToken = req.headers.authorization;
      const decodedToken = jwt.decode(headerToken.replace('Bearer ', ''), { complete: true });
      const { id } = decodedToken.payload;
      const { body } = req;

      const task: TaskDto = await this.taskService.complete(id, body);

      res.status(200).json(task);
    } catch (error) {
      next(error);
    }
  };

  public assign = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await this.taskService.assign();

      res.status(200).json('Tasks have been assigned');
    } catch (error) {
      next(error);
    }
  };

  public getDevelopersTasks = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const tasks: TaskDto[] = await this.taskService.allWhere('developer_id', id);

      res.status(200).json(tasks);
    } catch (error) {
      next(error);
    }
  };
}
