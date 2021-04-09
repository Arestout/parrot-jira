import { CreateTaskDto } from '../task.dto';
import { TaskDto } from './task.interface';

export interface ITaskService {
  create(taskData: CreateTaskDto): Promise<TaskDto>;
  update(taskData: TaskDto): Promise<TaskDto>;
  getMostExpensiveTasksValues(): Promise<Record<string, number>>;
}
