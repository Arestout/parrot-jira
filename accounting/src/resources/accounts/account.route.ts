import { Router } from 'express';
import { AccountController } from './account.controller';
import { Route } from '../../interfaces/routes.interface';
import { checkRole } from '../../middlewares/authZ.middleware';

export class AccountRoute implements Route {
  public path = '/accounting';
  public router = Router();
  public accountsController = new AccountController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}/`, [checkRole(['admin', 'accountant'])], this.accountsController.getDailyData);
  }
}
