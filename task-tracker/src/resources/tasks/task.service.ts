import { v4 as uuidv4 } from 'uuid';

import { UserDto } from '../users/interfaces/user.interface';
import { TaskDto } from './interfaces/task.interface';
import { ITaskRepository } from './interfaces/taskRepository.interface';
import { IUserRepository } from '../users/interfaces/userRepository.interface';
import { random } from '../../utils/random';
import { IKafkaProducer } from '../../libs/kafka/kafka.interface';

export class TaskService {
  protected taskRepository: ITaskRepository;
  protected userRepository: IUserRepository;
  protected kafkaProducer: IKafkaProducer;
  private topic = 'task-topic';

  constructor(taskRepository: ITaskRepository, userRepository: IUserRepository, kafkaProducer: IKafkaProducer) {
    this.taskRepository = taskRepository;
    this.userRepository = userRepository;
    this.kafkaProducer = kafkaProducer;
  }

  public async all(): Promise<TaskDto[]> {
    const tasks: TaskDto[] = await this.taskRepository.all();

    return tasks;
  }

  public async allWhere<T>(key: string, value: T): Promise<TaskDto[]> {
    const tasks: TaskDto[] = await this.taskRepository.allWhere(key, value);

    return tasks;
  }

  public async get(id: string): Promise<TaskDto> {
    const task = await this.taskRepository.get(id);

    return task;
  }

  public async create(taskDto: TaskDto): Promise<TaskDto> {
    const task: TaskDto = await this.taskRepository.create(taskDto);

    return task;
  }

  public async update(taskDto: TaskDto): Promise<TaskDto> {
    const task: TaskDto = await this.taskRepository.findOneAndUpdate(taskDto);

    const event = {
      key: 'TaskCreated',
      value: JSON.stringify({ event_id: uuidv4(), id: task.id }),
    };
    await this.kafkaProducer.sendMessage(this.topic, [event]);

    return task;
  }

  public async assign(): Promise<TaskDto[]> {
    const [tasks, developers] = await Promise.all([this.taskRepository.allRandom(), this.userRepository.allWhere('role', 'developer')]);

    const taskPromises = tasks.map(assignTasks);
    await Promise.all(taskPromises);

    async function assignTasks(task: TaskDto) {
      const developer: UserDto = developers[random(0, tasks.length)];
      task.developerId = developer.public_id;
      const updatedTask = await this.taskRepository.findOneAndUpdat(task);
      const { id, developerId } = updatedTask;

      const event = {
        key: 'TaskUpdated',
        value: JSON.stringify({ event_id: uuidv4(), id, developerId }),
      };
      await this.kafkaProducer.sendMessage(this.topic, [event]);
    }

    return tasks;
  }
}
