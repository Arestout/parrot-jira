import { CreateTaskDto } from '../task.dto';
import { TaskDto } from './task.interface';

export interface ITaskService {
  all(): Promise<TaskDto[]>;
  get(taskId: string): Promise<TaskDto>;
  create(taskData: CreateTaskDto): Promise<TaskDto>;
  update(taskData: TaskDto): Promise<TaskDto>;
  getDailyTaskValuesSum(): Promise<number>;
}
