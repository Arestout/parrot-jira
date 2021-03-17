import { Router } from 'express';

import { Route } from '../../interfaces/routes.interface';
import authMiddleware from '../../middlewares/auth.middleware';
import { TaskController } from './task.controller';

export class TaskRoute implements Route {
  public path = '/tasks';
  public router = Router();
  public blockController = new TaskController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}/`, authMiddleware, this.blockController.getAll);
    this.router.get(`${this.path}/:id`, authMiddleware, this.blockController.getById);
    this.router.post(`${this.path}/`, authMiddleware, this.blockController.create);
    this.router.put(`${this.path}/:id`, authMiddleware, this.blockController.update);
  }
}
