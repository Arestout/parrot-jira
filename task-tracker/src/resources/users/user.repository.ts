import { UserDto } from './interfaces/user.interface';
import DB from '../../database/index';
import { isEmpty } from '../../utils/util';
import { IUserRepository } from './interfaces/userRepository.interface';
import { CreateUserDto } from './user.dto';

export class UserRepository implements IUserRepository {
  protected users = DB.Users;

  public async all(): Promise<UserDto[]> {
    const allUser: UserDto[] = await this.users.findAll();
    return allUser;
  }

  public async allWhere<T>(key: string, value: T): Promise<UserDto[]> {
    const tasks: UserDto[] = await this.users.findAll({
      where: {
        [key]: value,
      },
    });

    return tasks;
  }

  public async find(userId: string): Promise<UserDto> {
    if (isEmpty(userId)) throw new Error("You're not userId");

    const findUser: UserDto = await this.users.findByPk(userId, { raw: true });
    if (!findUser) throw new Error("You're not user");

    return findUser;
  }

  public async create(userData: CreateUserDto): Promise<UserDto> {
    if (isEmpty(userData)) throw new Error("You're not userData");

    const transaction = await DB.sequelize.transaction();

    try {
      const findUser: UserDto = await this.users.findOne({ where: { email: userData.email } });
      if (findUser) throw new Error(`Your email ${userData.email} already exists`);

      const createUserData: UserDto = await this.users.create(userData);

      await transaction.commit();
      return createUserData;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  public async update(userData: UserDto): Promise<UserDto> {
    if (isEmpty(userData)) throw new Error("You're not userData");

    const transaction = await DB.sequelize.transaction();

    try {
      const findUser: UserDto = await this.users.findByPk(userData.public_id);
      if (!findUser) throw new Error("You're not user");

      await this.users.update(userData, { where: { public_id: userData.public_id } });

      const updateUser: UserDto = await this.users.findByPk(userData.public_id);

      await transaction.commit();
      return updateUser;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  public async delete(userId: string): Promise<UserDto> {
    if (isEmpty(userId)) throw new Error("You're not userId");

    const transaction = await DB.sequelize.transaction();

    try {
      const findUser: UserDto = await this.users.findByPk(userId);
      if (!findUser) throw new Error("You're not user");

      await this.users.destroy({ where: { public_id: userId } });

      await transaction.commit();
      return findUser;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  public async checkRole(role: string, id: string): Promise<boolean> {
    const findUser: UserDto = await this.users.findOne({ where: { public_id: id }, raw: true });
    if (!findUser) throw new Error("You're not user");

    if (findUser.role === role) {
      return true;
    }

    return false;
  }
}
