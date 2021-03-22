import { Router } from 'express';
import { AuthController } from './auth.controller';
import { UserController } from '../users/user.controller';
import { CreateUserDto, LoginUser } from '../users/user.dto';
import { Route } from '../../interfaces/routes.interface';
import validationMiddleware from '../../middlewares/validation.middleware';

export class AuthRoute implements Route {
  public path = '/auth';
  public router = Router();
  public authController = new AuthController();
  public userController = new UserController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(`${this.path}/signup`, validationMiddleware(CreateUserDto, 'body'), this.userController.createUser);
    this.router.post(`${this.path}/login`, validationMiddleware(LoginUser, 'body'), this.authController.logIn);
  }
}
