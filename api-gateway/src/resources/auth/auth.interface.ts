import { Request } from 'express';
import { UserDto } from '../users/interfaces/user.interface';

export interface DataStoredInToken {
  id: string;
}

export interface TokenData {
  token: string;
  expiresIn: number;
}

export interface RequestWithUser extends Request {
  user: UserDto;
}
