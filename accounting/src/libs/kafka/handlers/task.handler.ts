import { Message } from 'kafkajs';
import { IErrorService } from '../../../resources/errors/interfaces/errorService.interface';
import { ITaskService } from '../../../resources/tasks/interfaces/taskService.interface';
import { Handler } from './abstractHandler';

export class TaskHandler extends Handler {
  private taskService: ITaskService;

  public constructor(taskService: ITaskService, errorService: IErrorService) {
    super(errorService);
    this.taskService = taskService;
  }

  public async consumeMessage(message: Message): Promise<void> {
    switch (message.key.toString()) {
      case 'TaskCreated':
        if (!this.checkVersion('1', message)) {
          return this.createError(message);
        }
        await this.taskService.create(message.value);
        break;
      case 'TaskValueSet':
        if (!this.checkVersion('1', message)) {
          return this.createError(message);
        }
        await this.taskService.update(message.value);
        break;
      case 'TaskCompleted':
        if (!this.checkVersion('1', message)) {
          return this.createError(message);
        }
        await this.taskService.update(message.value);
        break;
      default:
        return;
    }
  }
}
