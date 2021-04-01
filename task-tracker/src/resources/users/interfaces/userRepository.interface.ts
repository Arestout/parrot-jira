import { CreateUserDto } from '../user.dto';
import { UserDto } from './user.interface';

export interface IUserRepository {
  all(): Promise<UserDto[]>;
  allWhere<T>(key: string, value: T): Promise<UserDto[]>;
  find(userId: string): Promise<UserDto>;
  create(userData: CreateUserDto): Promise<UserDto>;
  update(userData: UserDto): Promise<UserDto>;
  delete(userId: string): Promise<UserDto>;
}
