import { CreateUserDto } from '../user.dto';
import { UserDto } from './user.interface';

export interface IUserRepository {
  all(): Promise<UserDto[]>;
  find(userId: string): Promise<UserDto>;
  create(userData: CreateUserDto): Promise<UserDto>;
  update(userId: string, userData: UserDto): Promise<UserDto>;
  delete(userId: string): Promise<UserDto>;
}
