import { RequestHandler } from 'express';
import HttpException from '../utils/HttpException';
import jwt from 'jsonwebtoken';
import { UserDto } from './../resources/users/interfaces/user.interface';
import { UserRepository } from './../resources/users/user.repository';

const userRepository = new UserRepository();

export const checkRole = (role: string): RequestHandler => {
  return async (req, res, next) => {
    const headerToken = req.headers.authorization.replace('Bearer ', '');
    const decodedToken = jwt.decode(headerToken, { complete: true });
    const { id } = decodedToken.payload;

    const findUser: UserDto = await userRepository.find(id);

    if (findUser.role !== role) {
      return next(new HttpException(400, 'You are not manger'));
    }

    return next();
  };
};
