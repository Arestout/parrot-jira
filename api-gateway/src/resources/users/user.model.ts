import { Sequelize, DataTypes, Model, Optional } from 'sequelize';
import { UserDto } from './interfaces/user.interface';

export type UserCreationAttributes = Optional<UserDto, 'id' | 'public_id' | 'password' | 'role' | 'email'>;

export class UserModel extends Model<UserDto, UserCreationAttributes> implements UserDto {
  public id: string;
  public public_id: string;
  public fullName: string;
  public email: string;
  public role: string;
  public password: string;
  public slack: string;
  public mobile: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

export default function (sequelize: Sequelize): typeof UserModel {
  UserModel.init(
    {
      id: {
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
      },
      public_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        unique: true,
      },
      fullName: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      password: {
        type: DataTypes.STRING(255),
        defaultValue: false,
      },
      role: {
        type: DataTypes.ENUM('admin', 'developer', 'accountant', 'manager'),
        defaultValue: 'developer',
      },
      slack: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      mobile: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
    },
    {
      tableName: 'users',
      sequelize,
    },
  );

  return UserModel;
}
