import { Sequelize, DataTypes, Model, Optional } from 'sequelize';

import { UserDto } from './interfaces/user.interface';

export type UserCreationAttributes = Optional<UserDto, 'public_id' | 'fullName' | 'role'>;

export class UserModel extends Model<UserDto, UserCreationAttributes> implements UserDto {
  public public_id: string;
  public fullName: string;
  public role: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

export default function (sequelize: Sequelize): typeof UserModel {
  UserModel.init(
    {
      public_id: {
        primaryKey: true,
        type: DataTypes.UUID,
      },
      fullName: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      role: {
        type: DataTypes.ENUM('admin', 'developer', 'accountant', 'manager'),
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
