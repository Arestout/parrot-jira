import { TaskDto } from './task.interface';

export interface ITaskRepository {
  all(page: number): Promise<TaskDto[]>;
  find(id: string): Promise<TaskDto>;
  create(TaskDto: TaskDto): Promise<TaskDto>;
  findAndUpdate(TaskDto: TaskDto): Promise<TaskDto>;
  sum(): Promise<number>;
  getDailyTasks();
}
