import { TaskDto } from './interfaces/task.interface';
import HttpException from '../../utils/HttpException';
import DB from './../../database/index';
import { isEmpty } from '../../utils/util';
import { ITaskRepository } from './interfaces/taskRepository.interface';

export class TaskRepository implements ITaskRepository {
  public tasks = DB.Tasks;

  public async all(page: number): Promise<TaskDto[]> {
    const limit = 50;
    const tasks: TaskDto[] = await this.tasks.findAll({
      limit,
      offset: page * limit,
    });

    return tasks;
  }

  public async find(id: string): Promise<TaskDto> {
    const task: TaskDto = await this.tasks.findOne({
      where: { id },
    });

    if (isEmpty(task)) {
      throw new HttpException(404, 'Task was not found');
    }

    return task;
  }

  public async create(taskDTO: Partial<TaskDto>): Promise<TaskDto> {
    const task: TaskDto = await this.tasks.create({ ...taskDTO }).then(taskData => {
      return taskData.get({ plain: true });
    });

    return task;
  }

  public async findAndUpdate(taskDTO: TaskDto): Promise<TaskDto> {
    const findTask: TaskDto = await this.tasks.findByPk(taskDTO.id);
    if (isEmpty(findTask)) throw new HttpException(404, 'Task was not found');

    await this.tasks.update({ ...taskDTO }, { where: { id: taskDTO.id } });

    const updatedTask: TaskDto = await this.tasks.findByPk(taskDTO.id);

    return updatedTask;
  }
}
