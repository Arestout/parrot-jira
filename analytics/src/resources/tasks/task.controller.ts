import { NextFunction, Request, Response } from 'express';

import { TaskRepository } from './task.repository';
import { TaskService } from './task.service';

const taskRepository = new TaskRepository();

export class TaskController {
  private taskService = new TaskService(taskRepository);

  public getMostExpensiveTasks = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const values: Record<string, number> = await this.taskService.getMostExpensiveTasksValues();

      res.status(200).json(values);
    } catch (error) {
      next(error);
    }
  };
}
