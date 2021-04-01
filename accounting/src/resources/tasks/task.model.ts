import { Sequelize, DataTypes, Model, Optional } from 'sequelize';

import { random } from '../../utils/random';
import { TaskDto } from './interfaces/task.interface';

export type TaskCreationAttributes = Optional<TaskDto, 'id' | 'value' | 'description'>;

export class TaskModel extends Model<TaskDto, TaskCreationAttributes> implements TaskDto {
  public id: string;
  public description: string;
  public value: number;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  static associate(models) {
    this.hasMany(models.Transactions, { foreignKey: 'task_id' });
  }
}

export default function (sequelize: Sequelize): typeof TaskModel {
  TaskModel.init(
    {
      id: {
        primaryKey: true,
        type: DataTypes.UUID,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      value: {
        type: DataTypes.INTEGER,
        defaultValue: function () {
          return random(10, 30);
        },
      },
    },
    {
      tableName: 'tasks',
      sequelize,
    },
  );

  return TaskModel;
}
