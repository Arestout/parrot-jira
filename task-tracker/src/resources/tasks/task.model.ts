import { Sequelize, DataTypes, Model, Optional } from 'sequelize';
import { TaskDTO } from './interfaces/task.interface';

export type TaskCreationAttributes = Optional<TaskDTO, 'id' | 'description' | 'completed'>;

export class TaskModel extends Model<TaskDTO, TaskCreationAttributes> implements TaskDTO {
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
        defaultValue: DataTypes.UUIDV4,
      },
      description: {
        allowNull: false,
        type: DataTypes.TEXT,
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
