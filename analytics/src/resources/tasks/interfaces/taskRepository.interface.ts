import { TaskDto } from './task.interface';

export interface ITaskRepository {
  create(TaskDto: TaskDto): Promise<TaskDto>;
  findAndUpdate(TaskDto: TaskDto): Promise<TaskDto>;
  getMostExpensiveTaskValue(start: string, end: string): Promise<number>;
}
