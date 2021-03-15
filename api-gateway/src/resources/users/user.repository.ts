import { UserDto } from './interfaces/user.interface';
import { HttpException } from '../../utils/HttpException';
import DB from '../../database/index';
import { isEmpty } from '../../utils/util';
import { IUserRepository } from './interfaces/userRepository.interface';
import { CreateUserDto } from './user.dto';

export class UserRepository implements IUserRepository {
  protected users = DB.Users;

  public async findAllUser(): Promise<UserDto[]> {
    const allUser: UserDto[] = await this.users.findAll();
    return allUser;
  }

  public async findUserById(userId: string): Promise<UserDto> {
    if (isEmpty(userId)) throw new HttpException(400, "You're not userId");

    const findUser: UserDto = await this.users.findByPk(userId);
    if (!findUser) throw new HttpException(409, "You're not user");

    return findUser;
  }

  public async createUser(userData: CreateUserDto): Promise<UserDto> {
    if (isEmpty(userData)) throw new HttpException(400, "You're not userData");

    const findUser: UserDto = await this.users.findOne({ where: { email: userData.email } });
    if (findUser) throw new HttpException(409, `You're email ${userData.email} already exists`);

    const createUserData: UserDto = await this.users.create(userData);

    return createUserData;
  }

  public async updateUser(userId: string, userData: UserDto): Promise<UserDto> {
    if (isEmpty(userData)) throw new HttpException(400, "You're not userData");

    const findUser: UserDto = await this.users.findByPk(userId);
    if (!findUser) throw new HttpException(409, "You're not user");

    await this.users.update(userData, { where: { id: userId } });

    const updateUser: UserDto = await this.users.findByPk(userId);
    return updateUser;
  }

  public async deleteUserData(userId: string): Promise<UserDto> {
    if (isEmpty(userId)) throw new HttpException(400, "You're not userId");

    const findUser: UserDto = await this.users.findByPk(userId);
    if (!findUser) throw new HttpException(409, "You're not user");

    await this.users.destroy({ where: { id: userId } });

    return findUser;
  }
}
