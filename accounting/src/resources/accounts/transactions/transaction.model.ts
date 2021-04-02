import { Sequelize, DataTypes, Model, Optional } from 'sequelize';

import { TransactionDto } from './transaction.interface';

export type TaskCreationAttributes = Optional<TransactionDto, 'id' | 'account_id' | 'debit' | 'credit' | 'type' | 'description'>;

export class TransactionModel extends Model<TransactionDto, TaskCreationAttributes> implements TransactionDto {
  public id: string;
  public account_id: string;
  public debit: number;
  public credit: number;
  public task_id: string;
  public description: string;
  public type: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  static associate(models) {
    this.belongsTo(models.Accounts, { foreignKey: 'account_id' });
    this.belongsTo(models.Tasks, { foreignKey: 'task_id' });
  }
}

export default function (sequelize: Sequelize): typeof TransactionModel {
  TransactionModel.init(
    {
      id: {
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
      },
      account_id: {
        type: DataTypes.UUID,
      },
      debit: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      credit: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      task_id: {
        type: DataTypes.UUID,
      },
      type: {
        type: DataTypes.TEXT,
      },
      description: {
        type: DataTypes.TEXT,
      },
    },
    {
      tableName: 'transactions',
      sequelize,
    },
  );

  return TransactionModel;
}
