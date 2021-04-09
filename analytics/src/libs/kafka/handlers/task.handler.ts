import { Message } from 'kafkajs';
import { IErrorService } from '../../../resources/errors/interfaces/errorService.interface';
import { IEventService } from '../../../resources/events/interfaces/eventService.interface';
import { ITaskService } from '../../../resources/tasks/interfaces/taskService.interface';
import { Handler } from './abstractHandler';

export class TaskHandler extends Handler {
  private taskService: ITaskService;
  private eventService: IEventService;

  public constructor(taskService: ITaskService, errorService: IErrorService, eventService: IEventService) {
    super(errorService);
    this.taskService = taskService;
    this.eventService = eventService;
  }

  public async consumeMessage(message: Message): Promise<void> {
    switch (message.key.toString()) {
      case 'TaskCreated':
        if (!this.checkVersion('1', message)) {
          return this.createError(message);
        }
        await Promise.all([this.taskService.create(message.value), this.eventService.create(message)]);
        break;
      case 'TaskValueSet':
        if (!this.checkVersion('1', message)) {
          return this.createError(message);
        }
        await Promise.all([this.taskService.update(message.value), this.eventService.create(message)]);
        break;
      case 'TaskCompleted':
        if (!this.checkVersion('1', message)) {
          return this.createError(message);
        }
        await Promise.all([this.taskService.update(message.value), this.eventService.create(message)]);
        break;
      default:
        return;
    }
  }
}
