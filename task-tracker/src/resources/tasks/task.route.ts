import { Router } from 'express';

import { Routes } from '../../interfaces/routes.interface';
import { checkRole } from '../../middlewares/authZ.middleware';
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
    this.router.put(`${this.path}/assign`, [checkRole('manager')], this.blockController.assign);
    this.router.put(`${this.path}/:id`, [checkRole('developer')], this.blockController.complete);
    this.router.get(`${this.path}/developer/:id`, [checkRole('developer')], this.blockController.getDevelopersTasks);
  }
}
