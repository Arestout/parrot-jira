import { CreateUserDto } from '../user.dto';
import { UserDto } from './user.interface';

export interface IUserRepository {
  findAllUser(): Promise<UserDto[]>;
  findUserById(userId: string): Promise<UserDto>;
  createUser(userData: CreateUserDto): Promise<UserDto>;
  updateUser(userId: string, userData: UserDto): Promise<UserDto>;
  deleteUserData(userId: string): Promise<UserDto>;
}
