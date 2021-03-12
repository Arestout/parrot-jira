import { TaskDTO } from './interfaces/task.interface';
import HttpException from '../../utils/HttpException';
import DB from './../../database/index';
import { isEmpty } from '../../utils/util';
import { ITaskRepository } from './interfaces/taskRepository.interface';

export class TaskRepository implements ITaskRepository {
  public tasks = DB.Tasks;

  public async getAll(page: number): Promise<TaskDTO[]> {
    const limit = 50;
    const tasks = await this.tasks.findAll({
      limit,
      offset: page * limit,
    });

    return tasks;
  }

  public async getById(id: string): Promise<TaskDTO> {
    const task = await this.tasks.findOne({
      where: { id },
    });

    if (isEmpty(task)) {
      throw new HttpException(404, 'Task was not found');
    }

    return task;
  }

  public async create(taskDTO: Partial<TaskDTO>): Promise<TaskDTO> {
    const task = await this.tasks.create({ ...taskDTO });

    return task;
  }

  public async findOneAndUpdate(taskDTO: TaskDTO): Promise<TaskDTO> {
    const findTask = await this.tasks.findByPk(taskDTO.id);
    if (isEmpty(findTask)) throw new HttpException(404, 'Task was not found');

    await this.tasks.update({ ...taskDTO }, { where: { id: taskDTO.id } });

    const updatedTask = await this.tasks.findByPk(taskDTO.id);

    return updatedTask;
  }
}
