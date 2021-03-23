import { TaskDto } from './interfaces/task.interface';
import HttpException from '../../utils/HttpException';
import DB from './../../database/index';
import { isEmpty } from '../../utils/util';
import { ITaskRepository } from './interfaces/taskRepository.interface';

export class TaskRepository implements ITaskRepository {
  public tasks = DB.Tasks;

  public async all(): Promise<TaskDto[]> {
    const tasks = await this.tasks.findAll();

    return tasks;
  }

  public async allWhere<T>(key: string, value: T): Promise<TaskDto[]> {
    const tasks: TaskDto[] = await this.tasks.findAll({
      where: {
        [key]: value,
      },
    });

    return tasks;
  }

  public async allRandom(): Promise<TaskDto[]> {
    const tasks: TaskDto[] = await this.tasks.findAll({
      where: {
        completed: false,
      },
      order: DB.Sequelize.literal('random()'),
    });

    return tasks;
  }

  public async get(id: string): Promise<TaskDto> {
    const task = await this.tasks.findOne({
      where: { id },
    });

    if (isEmpty(task)) {
      throw new HttpException(404, 'Task was not found');
    }

    return task;
  }

  public async create(taskDto: Partial<TaskDto>): Promise<TaskDto> {
    const task = await this.tasks.create({ ...taskDto });

    return task;
  }

  public async findOneAndUpdate(taskDto: TaskDto): Promise<TaskDto> {
    const transaction = await DB.sequelize.transaction();
    try {
      const findTask = await this.tasks.findByPk(taskDto.id);
      if (isEmpty(findTask)) throw new HttpException(404, 'Task was not found');

      await this.tasks.update({ ...taskDto }, { where: { id: taskDto.id } });

      const updatedTask = await this.tasks.findByPk(taskDto.id);

      await transaction.commit();
      return updatedTask;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }
}
