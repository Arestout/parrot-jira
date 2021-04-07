import { TaskDto } from './interfaces/task.interface';
import HttpException from '../../utils/HttpException';
import DB from './../../database/index';
import { isEmpty } from '../../utils/util';
import { ITaskRepository } from './interfaces/taskRepository.interface';

export class TaskRepository implements ITaskRepository {
  public tasks = DB.Tasks;

  public async create(taskDTO: Partial<TaskDto>): Promise<TaskDto> {
    if (isEmpty(taskDTO)) throw new Error('Empty task data');

    const task: TaskDto = await this.tasks.create({ ...taskDTO });

    return task;
  }

  public async findAndUpdate(taskDTO: TaskDto): Promise<TaskDto> {
    const transaction = await DB.sequelize.transaction();

    try {
      const findTask: TaskDto = await this.tasks.findByPk(taskDTO.id);
      if (isEmpty(findTask)) throw new HttpException(404, 'Task was not found');

      await this.tasks.update({ ...taskDTO }, { where: { id: taskDTO.id } });

      const updatedTask: TaskDto = await this.tasks.findByPk(taskDTO.id);

      transaction.commit();
      return updatedTask;
    } catch (error) {
      transaction.rollback();
      throw error;
    }
  }

  public async sum(): Promise<number> {
    const dayStart = new Date().setHours(0, 0, 0, 0);
    const dayEnd = new Date().setHours(23, 59, 59, 999);

    const tasksSum = await this.tasks.sum('value', {
      where: {
        createdAt: {
          [DB.Sequelize.Op.gt]: dayStart,
          [DB.Sequelize.Op.lt]: dayEnd,
        },
        completed: true,
      },
    });

    return tasksSum;
  }

  public async getMostExpensiveTaskValue(start: Date, end: Date): Promise<number> {
    const value: number = await this.tasks.max('value', {
      where: {
        createdAt: {
          [DB.Sequelize.Op.gt]: start,
          [DB.Sequelize.Op.lt]: end,
        },
        completed: true,
      },
    });

    return value;
  }
}
