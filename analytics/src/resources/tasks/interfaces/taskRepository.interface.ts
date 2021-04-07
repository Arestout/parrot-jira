import { TaskDto } from './task.interface';

export interface ITaskRepository {
  create(TaskDto: TaskDto): Promise<TaskDto>;
  findAndUpdate(TaskDto: TaskDto): Promise<TaskDto>;
  getMostExpensiveTaskValue(start: Date, end: Date): Promise<number>;
}
