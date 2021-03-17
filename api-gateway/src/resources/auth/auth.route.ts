import { Router } from 'express';
import { AuthController } from './auth.controller';
import { CreateUserDto, LoginUser } from '../users/user.dto';
import { Route } from '../../interfaces/routes.interface';
import authMiddleware from '../../middlewares/auth.middleware';
import validationMiddleware from '../../middlewares/validation.middleware';

export class AuthRoute implements Route {
  public path = '/auth';
  public router = Router();
  public authController = new AuthController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(`${this.path}/signup`, validationMiddleware(CreateUserDto, 'body'), this.authController.signUp);
    this.router.post(`${this.path}/login`, validationMiddleware(LoginUser, 'body'), this.authController.logIn);
    this.router.post(`${this.path}/logout`, authMiddleware, this.authController.logOut);
  }
}
