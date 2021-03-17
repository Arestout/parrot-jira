import { NextFunction, Request, Response } from 'express';
import { CreateUserDto } from '../users/user.dto';
import { AuthService } from './auth.service';
import { UserDto } from '../users/interfaces/user.interface';
import { RequestWithUser } from './auth.interface';

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
      const { cookie, findUser } = await this.authService.login(userData);
      res.setHeader('Set-Cookie', [cookie]);
      res.status(200).json({ data: findUser, message: 'login' });
    } catch (error) {
      next(error);
    }
  };

  public logOut = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    const userData: UserDto = req.user;

    try {
      const logOutUserData: UserDto = await this.authService.logout(userData);
      res.setHeader('Set-Cookie', ['Authorization=; Max-age=0']);
      res.status(200).json({ data: logOutUserData, message: 'logout' });
    } catch (error) {
      next(error);
    }
  };
}
