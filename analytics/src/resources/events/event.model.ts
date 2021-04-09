import { Sequelize, DataTypes, Model, Optional } from 'sequelize';

import { EventDto } from './interfaces/event.interface';

export type TaskCreationAttributes = Optional<EventDto, 'id' | 'event_id' | 'event_version' | 'event_name' | 'event_time' | 'producer' | 'message'>;

export class EventModel extends Model<EventDto, TaskCreationAttributes> implements EventDto {
  public id: string;
  public event_id: string;
  public event_version: string;
  public event_name: string;
  public event_time: string;
  public producer: string;
  public message: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

export default function (sequelize: Sequelize): typeof EventModel {
  EventModel.init(
    {
      id: {
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
      },
      event_id: {
        primaryKey: true,
        type: DataTypes.UUID,
        allowNull: false,
      },
      event_version: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      event_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      event_time: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      producer: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      message: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
    },
    {
      tableName: 'events',
      sequelize,
    },
  );

  return EventModel;
}
