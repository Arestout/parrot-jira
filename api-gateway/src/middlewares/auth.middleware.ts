import { NextFunction, Response } from 'express';
import jwt from 'jsonwebtoken';
import { HttpException } from '../utils/HttpException';
import { DataStoredInToken, RequestWithUser } from '../resources/auth/auth.interface';
import { JWT_SECRET } from '../config';

const authMiddleware = async (req: RequestWithUser, res: Response, next: NextFunction) => {
  try {
    const cookies = req.cookies;
    if (cookies && cookies.Authorization) {
      jwt.verify(cookies.Authorization, JWT_SECRET, err => {
        if (err) {
          return next(new HttpException(401, 'Invalid authentication token'));
        }

        return next();
      }) as DataStoredInToken;
    } else {
      next(new HttpException(404, 'Authentication token missing'));
    }
  } catch (error) {
    next(new HttpException(401, 'Wrong authentication token'));
  }
};

export default authMiddleware;
