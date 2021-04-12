import { v4 as uuidv4 } from 'uuid';

import { TaskDto } from './interfaces/task.interface';
import { ITaskRepository } from './interfaces/taskRepository.interface';
import { IKafkaProducer } from '../../libs/kafka/kafka.interface';
import { taskValueSetSchema } from './../../libs/kafka/schemas/taskValueSet.schema';
import { TASK_TOPIC } from '../../config';
import { ITaskService } from './interfaces/taskService.interface';

export class TaskService implements ITaskService {
  public taskRepository: ITaskRepository;
  public kafkaProducer: IKafkaProducer;

  constructor(repository: ITaskRepository, kafkaProducer: IKafkaProducer) {
    this.taskRepository = repository;
    this.kafkaProducer = kafkaProducer;
  }

  public async all(): Promise<TaskDto[]> {
    const tasks: TaskDto[] = await this.taskRepository.all();

    return tasks;
  }

  public async get(id: string): Promise<TaskDto> {
    const task: TaskDto = await this.taskRepository.find(id);

    return task;
  }

  public async create(taskDTO: TaskDto): Promise<TaskDto> {
    console.log(taskDTO);
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
    await this.kafkaProducer.sendMessage(TASK_TOPIC, [event]);

    return task;
  }

  public async update(taskDTO: TaskDto): Promise<TaskDto> {
    const task: TaskDto = await this.taskRepository.findAndUpdate(taskDTO);

    return task;
  }

  public async getDailyTaskValuesSum(): Promise<number> {
    const dailyTaskValuesSum = await this.taskRepository.sum();

    return dailyTaskValuesSum;
  }
}
