import { NextFunction, Request, Response } from 'express';
import { CreateUserDto } from '../users/user.dto';
import { AuthService } from './auth.service';
import { UserDto } from '../users/interfaces/user.interface';

export class AuthController {
  public authService = new AuthService();

  public signUp = async (req: Request, res: Response, next: NextFunction) => {
    const userData: CreateUserDto = req.body;

    try {
      const signUpUserData: UserDto = await this.authService.signup(userData);
      res.status(201).json({ data: signUpUserData, message: 'Registration successful' });
    } catch (error) {
      next(error);
    }
  };

  public logIn = async (req: Request, res: Response, next: NextFunction) => {
    const userData: CreateUserDto = req.body;

    try {
      const { tokenData, findUser } = await this.authService.login(userData);
      res.status(200).json({ tokenData, userData: findUser, message: 'login' });
    } catch (error) {
      next(error);
    }
  };
}
