import { TaskDto } from './task.interface';

export interface ITaskRepository {
  all(): Promise<TaskDto[]>;
  allWhere<T>(key: string, value: T): Promise<TaskDto[]>;
  allRandom(): Promise<TaskDto[]>;
  get(id: string): Promise<TaskDto>;
  create(taskDto: TaskDto): Promise<TaskDto>;
  findOneAndUpdate(taskDto: TaskDto): Promise<TaskDto>;
}
