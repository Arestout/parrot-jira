import { TaskDto } from './interfaces/task.interface';
import { ITaskRepository } from './interfaces/taskRepository.interface';

export class TaskService {
  public taskRepository: ITaskRepository;

  constructor(repository: ITaskRepository) {
    this.taskRepository = repository;
  }

  public async all(page: number): Promise<TaskDto[]> {
    const tasks: TaskDto[] = await this.taskRepository.all(page);

    return tasks;
  }

  public async get(id: string): Promise<TaskDto> {
    const task: TaskDto = await this.taskRepository.find(id);

    return task;
  }

  public async create(taskDTO: TaskDto): Promise<TaskDto> {
    const task: TaskDto = await this.taskRepository.create(taskDTO);

    return task;
  }

  public async update(taskDTO: TaskDto): Promise<TaskDto> {
    const task: TaskDto = await this.taskRepository.findAndUpdate(taskDTO);

    return task;
  }
}
