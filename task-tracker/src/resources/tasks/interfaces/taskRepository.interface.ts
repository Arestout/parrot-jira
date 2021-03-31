import { TaskDto } from './task.interface';

export interface ITaskRepository {
  all(): Promise<TaskDto[]>;
  allWhere<T>(key: string, value: T): Promise<TaskDto[]>;
  allRandom(): Promise<TaskDto[]>;
  find(id: string): Promise<TaskDto>;
  create(taskDto: TaskDto): Promise<TaskDto>;
  complete(id: string, taskDto: TaskDto): Promise<TaskDto>;
  updateMany(tasks: TaskDto[]): Promise<void>;
}
