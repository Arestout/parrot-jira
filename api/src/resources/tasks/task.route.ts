import { Router } from 'express';

import { Routes } from '../../interfaces/routes.interface';
import { TaskController } from './task.controller';

export class TaskRoute implements Routes {
  public path = '/tasks';
  public router = Router();
  public blockController = new TaskController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}/`, this.blockController.getAll);
    this.router.get(`${this.path}/:id`, this.blockController.getById);
    this.router.post(`${this.path}/`, this.blockController.create);
    this.router.put(`${this.path}/:id`, this.blockController.update);
  }
}
