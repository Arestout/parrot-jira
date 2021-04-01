import { IUserRepository } from './interfaces/userRepository.interface';
import { CreateUserDto } from './user.dto';
import { UserDto } from './interfaces/user.interface';
import { IUserService } from './interfaces/userService.interface';

export class UserService implements IUserService {
  protected userRepository: IUserRepository;

  constructor(repository: IUserRepository) {
    this.userRepository = repository;
  }

  public async all(): Promise<UserDto[]> {
    const allUser: UserDto[] = await this.userRepository.all();

    return allUser;
  }

  public async find(userId: string): Promise<UserDto> {
    const findUser: UserDto = await this.userRepository.find(userId);

    return findUser;
  }

  public async create(userData: CreateUserDto): Promise<UserDto> {
    try {
      const createUserData: UserDto = await this.userRepository.create(userData);

      return createUserData;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  public async update(userData: UserDto): Promise<UserDto> {
    await this.userRepository.update(userData);

    const updateUser: UserDto = await this.userRepository.find(userData.public_id);

    return updateUser;
  }

  public async delete(userId: string): Promise<UserDto> {
    const findUser: UserDto = await this.userRepository.find(userId);

    await this.userRepository.delete(userId);

    return findUser;
  }
}
