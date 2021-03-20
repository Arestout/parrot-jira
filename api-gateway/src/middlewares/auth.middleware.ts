import { NextFunction, Response } from 'express';
import jwt from 'jsonwebtoken';
import { HttpException } from '../utils/HttpException';
import { DataStoredInToken, RequestWithUser } from '../resources/auth/auth.interface';
import { JWT_SECRET } from '../config';

const authMiddleware = async (req: RequestWithUser, res: Response, next: NextFunction) => {
  const headerToken = req.headers.authorization;

  if (!headerToken) {
    return next(new HttpException(401, 'Authentication token missing'));
  }

  const [tokenType, token] = headerToken.split(' ');

  if (tokenType !== 'Bearer') {
    return next(new HttpException(401, 'Invalid authentication token'));
  }

  if (!token) {
    return next(new HttpException(401, 'Authentication token missing'));
  }

  jwt.verify(token, JWT_SECRET, err => {
    if (err) {
      return next(new HttpException(401, 'Invalid authentication token'));
    }

    return next();
  }) as DataStoredInToken;
};

export default authMiddleware;
