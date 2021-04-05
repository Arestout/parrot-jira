import { startOfDay, endOfDay, startOfWeek, startOfMonth } from 'date-fns';

import { TaskDto } from './interfaces/task.interface';
import { ITaskRepository } from './interfaces/taskRepository.interface';

export class TaskService {
  public taskRepository: ITaskRepository;

  constructor(repository: ITaskRepository) {
    this.taskRepository = repository;
  }

  public async create(taskDTO: TaskDto): Promise<TaskDto> {
    const task: TaskDto = await this.taskRepository.create(taskDTO);

    return task;
  }

  public async update(taskDTO: TaskDto): Promise<TaskDto> {
    const task: TaskDto = await this.taskRepository.findAndUpdate(taskDTO);

    return task;
  }

  public async getMostExpensiveTasksValues(): Promise<Record<string, number>> {
    const [daily, weekly, monthly] = await Promise.all([
      this.taskRepository.getMostExpensiveTaskValue(startOfDay(new Date()), endOfDay(new Date())),
      this.taskRepository.getMostExpensiveTaskValue(startOfWeek(new Date(), { weekStartsOn: 1 }), endOfDay(new Date())),
      this.taskRepository.getMostExpensiveTaskValue(startOfMonth(new Date()), endOfDay(new Date())),
    ]);

    return { daily, weekly, monthly };
  }
}
