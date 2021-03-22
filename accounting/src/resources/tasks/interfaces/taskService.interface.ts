import { CreateTaskDto } from '../task.dto';
import { TaskDto } from './task.interface';

export interface ITaskService {
  all(): Promise<TaskDto[]>;
  find(taskId: string): Promise<TaskDto>;
  create(taskData: CreateTaskDto): Promise<TaskDto>;
  update(taskData: TaskDto): Promise<TaskDto>;
  delete(taskId: string): Promise<TaskDto>;
}
