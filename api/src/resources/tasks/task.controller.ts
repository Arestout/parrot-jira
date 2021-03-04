import { NextFunction, Request, Response } from 'express';
import { TaskRepository } from './task.repository';
import { TaskService } from './task.service';

const taskRepository = new TaskRepository();

export class TaskController {
  private taskService = new TaskService(taskRepository);

  public async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const { page } = req.query;
      const tasks = await this.taskService.getAll(page);

      res.status(200).json(tasks);
    } catch (error) {
      next(error);
    }
  }

  public getById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const task = await this.taskService.getById(id);

      res.status(200).json(task);
    } catch (error) {
      next(error);
    }
  };

  public create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { body } = req;
      const task = await this.taskService.create(body);

      res.status(200).json(task);
    } catch (error) {
      next(error);
    }
  };

  public update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { body } = req;
      const task = await this.taskService.update(body);

      res.status(200).json(task);
    } catch (error) {
      next(error);
    }
  };
}
