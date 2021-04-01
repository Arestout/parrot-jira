import { v4 as uuidv4 } from 'uuid';
import { Mutex } from 'async-mutex';

import { UserDto } from '../users/interfaces/user.interface';
import { TaskDto } from './interfaces/task.interface';
import { ITaskRepository } from './interfaces/taskRepository.interface';
import { IUserRepository } from '../users/interfaces/userRepository.interface';
import { random } from '../../utils/random';
import { IKafkaProducer } from '../../libs/kafka/kafka.interface';
import { createdTaskSchema, assignedTaskSchema, completeTaskSchema } from './../../libs/kafka/schemas/task.schema';
import { Message } from 'kafkajs';

export class TaskService {
  protected taskRepository: ITaskRepository;
  protected userRepository: IUserRepository;
  protected kafkaProducer: IKafkaProducer;
  private topic = 'task-topic';
  private mutex = new Mutex();

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

  public async find(id: string): Promise<TaskDto> {
    const task = await this.taskRepository.find(id);

    return task;
  }

  public async create(taskDto: TaskDto): Promise<TaskDto> {
    const release = await this.mutex.acquire();

    try {
      const task: TaskDto = await this.taskRepository.create(taskDto);

      const encodedMessage = await this.kafkaProducer.encode(createdTaskSchema, { id: task.id });
      const event = {
        key: 'TaskCreated',
        value: encodedMessage,
        headers: {
          event_id: uuidv4(),
          event_version: '1',
          event_name: 'TaskCreated',
          event_time: Date.now().toString(),
          producer: 'task-service',
        },
      };
      await this.kafkaProducer.sendMessage(this.topic, [event]);

      return task;
    } finally {
      release();
    }
  }

  public async complete(id: string, taskDto: TaskDto): Promise<TaskDto> {
    const release = await this.mutex.acquire();

    try {
      const task: TaskDto = await this.taskRepository.complete(id, taskDto);

      const encodedMessage = await this.kafkaProducer.encode(completeTaskSchema, { id: task.id });

      const event = {
        key: 'TaskCompleted',
        value: encodedMessage,
        headers: {
          event_id: uuidv4(),
          event_version: '1',
          event_name: 'TaskCompleted',
          event_time: Date.now().toString(),
          producer: 'task-service',
        },
      };
      await this.kafkaProducer.sendMessage('task-completed-topic', [event]);
      return task;
    } finally {
      release();
    }
  }

  public async assign(): Promise<TaskDto[]> {
    const release = await this.mutex.acquire();

    try {
      const [tasks, developers] = await Promise.all([this.taskRepository.allRandom(), this.userRepository.allWhere('role', 'developer')]);

      const assignedTasks: TaskDto[] = tasks.map(task => {
        const developer: UserDto = developers[random(0, developers.length - 1)];
        task.developerId = developer.public_id;
        return task;
      });

      await this.taskRepository.updateMany(assignedTasks);

      const encodeTasks = async (task: TaskDto) => {
        const { id, developerId: public_id } = task;

        const encodedMessage = await this.kafkaProducer.encode(assignedTaskSchema, { id, public_id });
        const event = {
          key: 'TaskAssigned',
          value: encodedMessage,
          headers: {
            event_id: uuidv4(),
            event_version: '1',
            event_name: 'TaskAssigned',
            event_time: Date.now().toString(),
            producer: 'task-service',
          },
        };

        return event;
      };

      const taskPromises = assignedTasks.map(encodeTasks);
      const messages: Message[] = await Promise.all(taskPromises);
      await this.kafkaProducer.sendMessage('task-assigned-topic', messages);

      return tasks;
    } catch (error) {
      throw error;
    } finally {
      release();
    }
  }
}
