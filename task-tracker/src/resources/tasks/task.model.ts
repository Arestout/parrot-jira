import { Sequelize, DataTypes, Model, Optional } from 'sequelize';
import { TaskDto } from './interfaces/task.interface';

export type TaskCreationAttributes = Optional<TaskDto, 'id' | 'description' | 'completed' | 'developerId'>;

export class TaskModel extends Model<TaskDto, TaskCreationAttributes> implements TaskDto {
  public id: string;
  public description: string;
  public completed: boolean;
  public developerId: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

export default function (sequelize: Sequelize): typeof TaskModel {
  TaskModel.init(
    {
      id: {
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      completed: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      developerId: {
        type: DataTypes.UUID,
        defaultValue: null,
      },
    },
    {
      tableName: 'tasks',
      sequelize,
    },
  );

  return TaskModel;
}
