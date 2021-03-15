import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { CreateUserDto } from '../users/user.dto';
import { HttpException } from '../../utils/HttpException';
import { DataStoredInToken, TokenData } from './auth.interface';
import { UserDto } from '../users/interfaces/user.interface';
import DB from '../../database';
import { isEmpty } from '../../utils/util';

export class AuthService {
  public users = DB.Users;

  public async signup(userData: CreateUserDto): Promise<UserDto> {
    if (isEmpty(userData)) throw new HttpException(400, "You're not userData");

    const findUser: UserDto = await this.users.findOne({ where: { email: userData.email } });
    if (findUser) throw new HttpException(409, `You're email ${userData.email} already exists`);

    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const createUserData: UserDto = await this.users.create({ ...userData, password: hashedPassword });

    return createUserData;
  }

  public async login(userData: CreateUserDto): Promise<{ cookie: string; findUser: UserDto }> {
    if (isEmpty(userData)) throw new HttpException(400, "You're not userData");

    const findUser: UserDto = await this.users.findOne({ where: { email: userData.email } });
    if (!findUser) throw new HttpException(409, `You're email ${userData.email} not found`);

    const isPasswordMatching: boolean = await bcrypt.compare(userData.password, findUser.password);
    if (!isPasswordMatching) throw new HttpException(409, "You're password not matching");

    const tokenData = this.createToken(findUser);
    const cookie = this.createCookie(tokenData);

    return { cookie, findUser };
  }

  public async logout(userData: UserDto): Promise<UserDto> {
    if (isEmpty(userData)) throw new HttpException(400, "You're not userData");

    const findUser: UserDto = await this.users.findOne({ where: { password: userData.password } });
    if (!findUser) throw new HttpException(409, "You're not user");

    return findUser;
  }

  public createToken(user: UserDto): TokenData {
    const dataStoredInToken: DataStoredInToken = { id: user.id };
    const secret: string = process.env.JWT_SECRET;
    const expiresIn: number = 60 * 60;

    return { expiresIn, token: jwt.sign(dataStoredInToken, secret, { expiresIn }) };
  }

  public createCookie(tokenData: TokenData): string {
    return `Authorization=${tokenData.token}; HttpOnly; Max-Age=${tokenData.expiresIn};`;
  }
}
