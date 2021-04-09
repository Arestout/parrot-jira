import { CreateUserDto } from '../user.dto';
import { UserDto } from './user.interface';

export interface IUserService {
  create(userData: CreateUserDto): Promise<UserDto>;
  update(userData: UserDto): Promise<UserDto>;
  delete(userId: string): Promise<UserDto>;
}
