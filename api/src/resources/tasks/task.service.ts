import { TaskDTO } from './interfaces/task.interface';
import { ITaskRepository } from './interfaces/taskRepository.interface';

export class TaskService {
  public taskRepository: ITaskRepository;

  constructor(repository: ITaskRepository) {
    this.taskRepository = repository;
  }

  public async getAll(page: number): Promise<TaskDTO[]> {
    const tasks = await this.taskRepository.getAll(page);

    return tasks;
  }

  public async getById(id: string): Promise<TaskDTO> {
    const task = await this.taskRepository.getById(id);

    return task;
  }

  public async create(taskDTO: TaskDTO): Promise<TaskDTO> {
    const task = await this.taskRepository.create(taskDTO);

    return task;
  }

  public async update(taskDTO: TaskDTO): Promise<TaskDTO> {
    const task = await this.taskRepository.findOneAndUpdate(taskDTO);

    return task;
  }
}
