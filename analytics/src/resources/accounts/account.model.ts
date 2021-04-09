import { Sequelize, DataTypes, Model, Optional } from 'sequelize';

import { AccountDto } from './interfaces/account.interface';

export type TaskCreationAttributes = Optional<AccountDto, 'id' | 'user_id' | 'balance'>;

export class AccountModel extends Model<AccountDto, TaskCreationAttributes> implements AccountDto {
  public id: string;
  public user_id: string;
  public balance: number;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  static associate(models) {
    this.hasMany(models.Transactions, { foreignKey: 'account_id' });
  }
}

export default function (sequelize: Sequelize): typeof AccountModel {
  AccountModel.init(
    {
      id: {
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
      },
      user_id: {
        type: DataTypes.UUID,
        unique: true,
      },
      balance: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
    },
    {
      tableName: 'accounts',
      sequelize,
    },
  );

  return AccountModel;
}
