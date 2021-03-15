import { IUserRepository } from './interfaces/userRepository.interface';
import bcrypt from 'bcrypt';
import { CreateUserDto } from './user.dto';
import { UserDto } from './interfaces/user.interface';

export class UserService {
  protected userRepository: IUserRepository;

  constructor(repository: IUserRepository) {
    this.userRepository = repository;
  }

  public async findAllUser(): Promise<UserDto[]> {
    const allUser: UserDto[] = await this.userRepository.findAllUser();

    return allUser;
  }

  public async findUserById(userId: string): Promise<UserDto> {
    const findUser: UserDto = await this.userRepository.findUserById(userId);

    return findUser;
  }

  public async createUser(userData: CreateUserDto): Promise<UserDto> {
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const createUserData: UserDto = await this.userRepository.createUser({ ...userData, password: hashedPassword });

    return createUserData;
  }

  public async updateUser(userId: string, userData: UserDto): Promise<UserDto> {
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    await this.userRepository.updateUser(userId, { ...userData, password: hashedPassword });

    const updateUser: UserDto = await this.userRepository.findUserById(userId);
    return updateUser;
  }

  public async deleteUserData(userId: string): Promise<UserDto> {
    const findUser: UserDto = await this.userRepository.findUserById(userId);

    await this.userRepository.deleteUserData(userId);

    return findUser;
  }
}
