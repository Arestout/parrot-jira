import { Router } from 'express';
import { UserController } from './user.controller';
import { CreateUserDto } from './user.dto';
import { Route } from '../../interfaces/routes.interface';
import validationMiddleware from '../../middlewares/validation.middleware';
import authMiddleware from './../../middlewares/auth.middleware';

export class UserRoute implements Route {
  public path = '/users';
  public router = Router();
  public usersController = new UserController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}/all`, [authMiddleware], this.usersController.getUsers);
    this.router.get(`${this.path}`, [authMiddleware], this.usersController.getUserById);
    this.router.post(`${this.path}`, [authMiddleware], validationMiddleware(CreateUserDto, 'body'), this.usersController.createUser);
    this.router.put(`${this.path}/:id`, [authMiddleware], validationMiddleware(CreateUserDto, 'body', true), this.usersController.updateUser);
    this.router.delete(`${this.path}/:id`, [authMiddleware], this.usersController.deleteUser);
  }
}
