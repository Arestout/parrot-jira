import { v4 as uuidv4 } from 'uuid';

import { TaskDto } from './interfaces/task.interface';
import { ITaskRepository } from './interfaces/taskRepository.interface';
import { IKafkaProducer } from '../../libs/kafka/kafka.interface';
import { taskValueSetSchema } from './../../libs/kafka/schemas/taskValueSet.schema';

export class TaskService {
  public taskRepository: ITaskRepository;
  public kafkaProducer: IKafkaProducer;

  constructor(repository: ITaskRepository, kafkaProducer: IKafkaProducer) {
    this.taskRepository = repository;
    this.kafkaProducer = kafkaProducer;
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

    const encodedMessage = await this.kafkaProducer.encode(taskValueSetSchema, { id: task.id, value: task.value });
    const event = {
      key: 'taskValueSet',
      value: encodedMessage,
      headers: {
        event_id: uuidv4(),
        event_version: '1',
        event_name: 'taskValueSet',
        event_time: Date.now().toString(),
        producer: 'accounting-service',
      },
    };
    await this.kafkaProducer.sendMessage('task-topic', [event]);

    return task;
  }

  public async update(taskDTO: TaskDto): Promise<TaskDto> {
    const task: TaskDto = await this.taskRepository.findAndUpdate(taskDTO);

    return task;
  }
}
