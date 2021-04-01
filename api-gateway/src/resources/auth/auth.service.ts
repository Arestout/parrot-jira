import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { CreateUserDto, LoginUser } from '../users/user.dto';
import { HttpException } from '../../utils/HttpException';
import { DataStoredInToken, TokenData } from './auth.interface';
import { UserDto } from '../users/interfaces/user.interface';
import DB from '../../database';
import { isEmpty } from '../../utils/util';
export class AuthService {
  public users = DB.Users;

  public async signup(userData: CreateUserDto): Promise<UserDto> {
    if (isEmpty(userData)) throw new HttpException(400, "You're not userData");

    const transaction = await DB.sequelize.transaction();

    try {
      const findUser: UserDto = await this.users.findOne({ where: { email: userData.email } });
      if (findUser) throw new HttpException(409, `Your email ${userData.email} already exists`);

      const hashedPassword = await bcrypt.hash(userData.password, 10);
      const createUserData: UserDto = await this.users.create({ ...userData, password: hashedPassword });

      await transaction.commit();
      return createUserData;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  public async login(userData: LoginUser): Promise<{ tokenData: TokenData; findUser: UserDto }> {
    if (isEmpty(userData)) throw new HttpException(400, "You're not userData");

    const transaction = await DB.sequelize.transaction();

    try {
      const findUser: UserDto = await this.users.scope('withPassword').findOne({ where: { email: userData.email } });
      if (!findUser) throw new HttpException(409, `Wrong email or password`);

      const isPasswordMatching: boolean = await bcrypt.compare(userData.password, findUser.password);
      if (!isPasswordMatching) throw new HttpException(409, 'Wrong email or password');

      const tokenData = this.createToken(findUser);

      await transaction.commit();
      return { tokenData, findUser };
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  public createToken(user: UserDto): TokenData {
    const dataStoredInToken: DataStoredInToken = { id: user.public_id };
    const secret: string = process.env.JWT_SECRET;
    const expiresIn: number = 60 * 60;

    return { expiresIn, token: jwt.sign(dataStoredInToken, secret, { expiresIn }) };
  }
}
