import { Router } from 'express';

import { Route } from '../../interfaces/routes.interface';
import { checkRole } from '../../middlewares/authZ.middleware';
import { TaskController } from './task.controller';

export class TaskRoute implements Route {
  public path = '/tasks';
  public router = Router();
  public taskController = new TaskController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}/`, [checkRole(['admin'])], this.taskController.getMostExpensiveTasks);
  }
}
