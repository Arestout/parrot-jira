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
      raw: true,
    });

    return tasks;
  }

  public async allRandom(): Promise<TaskDto[]> {
    const tasks: TaskDto[] = await this.tasks.findAll({
      where: {
        completed: false,
      },
      order: DB.Sequelize.literal('random()'),
      raw: true,
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

  public async create(taskDto: Partial<TaskDto>): Promise<TaskDto> {
    const task: TaskDto = await this.tasks.create(taskDto).then(taskData => {
      return taskData.get({ plain: true });
    });

    return task;
  }

  public async complete(id: string, taskDto: TaskDto): Promise<TaskDto> {
    const transaction = await DB.sequelize.transaction();
    try {
      const findTask: TaskDto = await this.tasks.findByPk(taskDto.id, { raw: true });
      if (isEmpty(findTask)) throw new HttpException(404, 'Task was not found');
      if (findTask.developerId !== id) throw new HttpException(401, 'Unauthorized');

      await this.tasks.update({ ...taskDto }, { where: { id: taskDto.id } });

      const updatedTask: TaskDto = await this.tasks.findByPk(taskDto.id, { raw: true });

      await transaction.commit();
      return updatedTask;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  public async updateMany(tasks: TaskDto[]): Promise<void> {
    const transaction = await DB.sequelize.transaction();

    try {
      const taskPromises = tasks.map(task => this.tasks.update({ ...task }, { where: { id: task.id } }));
      await Promise.all(taskPromises);

      transaction.commit();
    } catch (error) {
      transaction.rollback();
      throw error;
    }
  }
}
