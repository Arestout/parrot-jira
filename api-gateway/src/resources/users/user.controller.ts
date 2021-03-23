import { NextFunction, Request, Response } from 'express';
import { CreateUserDto } from './user.dto';
import { UserDto } from './interfaces/user.interface';
import { UserService } from './user.service';
import { UserRepository } from './user.repository';
import { KafkaProducer } from '../../libs/kafka/kafka.producer';
import { userSchema } from './../../libs/kafka/schemas/user.schema';

const userRepository = new UserRepository();
const kafkaProducer = new KafkaProducer(userSchema);
export class UserController {
  public userService = new UserService(userRepository, kafkaProducer);

  public getUsers = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const findAllUsersData: UserDto[] = await this.userService.findAllUser();
      res.status(200).json({ data: findAllUsersData, message: 'findAll' });
    } catch (error) {
      next(error);
    }
  };

  public getUserById = async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.params.id;

    try {
      const findOneUserData: UserDto = await this.userService.findUserById(userId);
      res.status(200).json({ data: findOneUserData, message: 'findOne' });
    } catch (error) {
      next(error);
    }
  };

  public createUser = async (req: Request, res: Response, next: NextFunction) => {
    const userData: CreateUserDto = req.body;

    try {
      const createUserData: UserDto = await this.userService.createUser(userData);
      res.status(201).json({ data: createUserData, message: 'Registration successful' });
    } catch (error) {
      next(error);
    }
  };

  public updateUser = async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.params.id;
    const userData: UserDto = req.body;

    try {
      const updateUserData: UserDto = await this.userService.updateUser(userId, userData);
      res.status(200).json({ data: updateUserData, message: 'updated' });
    } catch (error) {
      next(error);
    }
  };

  public deleteUser = async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.params.id;

    try {
      const deleteUserData: UserDto = await this.userService.deleteUserData(userId);
      res.status(200).json({ data: deleteUserData, message: 'deleted' });
    } catch (error) {
      next(error);
    }
  };
}
