import { TaskDTO } from './task.interface';

export interface ITaskRepository {
  getAll(page: number): Promise<TaskDTO[]>;
  getById(id: string): Promise<TaskDTO>;
  create(taskDTO: TaskDTO): Promise<TaskDTO>;
  findOneAndUpdate(taskDTO: TaskDTO): Promise<TaskDTO>;
}
