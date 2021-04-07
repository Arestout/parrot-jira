import { Sequelize, DataTypes, Model, Optional } from 'sequelize';

import { random } from '../../utils/random';
import { TaskDto } from './interfaces/task.interface';

export type TaskCreationAttributes = Optional<TaskDto, 'id' | 'value' | 'completed'>;

export class TaskModel extends Model<TaskDto, TaskCreationAttributes> implements TaskDto {
  public id: string;
  public value: number;
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
      },
      value: {
        type: DataTypes.INTEGER,
        defaultValue: function () {
          return random(10, 30);
        },
      },
      completed: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
    },
    {
      tableName: 'tasks',
      sequelize,
    },
  );

  return TaskModel;
}
