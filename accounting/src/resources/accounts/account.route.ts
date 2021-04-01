import { Router } from 'express';
import { AccountController } from './account.controller';
import { Route } from '../../interfaces/routes.interface';

export class UserRoute implements Route {
  public path = '/accounts';
  public router = Router();
  public accountsController = new AccountController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}`, this.accountsController.getUsers);
  }
}
