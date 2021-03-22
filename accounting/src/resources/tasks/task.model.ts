import { Sequelize, DataTypes, Model, Optional } from 'sequelize';

import { random } from '../../utils/random';
import { TaskDto } from './interfaces/task.interface';

export type TaskCreationAttributes = Optional<TaskDto, 'id' | 'value'>;

export class TaskModel extends Model<TaskDto, TaskCreationAttributes> implements TaskDto {
  public id: string;
  public description: string;
  public completed: boolean;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

export default function (sequelize: Sequelize): typeof TaskModel {
  TaskModel.init(
    {
      id: {
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.random,
      },
      value: {
        type: DataTypes.INTEGER,
        defaultValue: random(10, 70),
      },
    },
    {
      tableName: 'tasks',
      sequelize,
    },
  );

  return TaskModel;
}
