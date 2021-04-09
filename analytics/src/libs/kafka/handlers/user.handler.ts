import { Message } from 'kafkajs';
import { IErrorService } from '../../../resources/errors/interfaces/errorService.interface';
import { IEventService } from '../../../resources/events/interfaces/eventService.interface';
import { IUserService } from '../../../resources/users/interfaces/userService.interface';
import { Handler } from './abstractHandler';

export class UserHandler extends Handler {
  private userService: IUserService;
  private eventService: IEventService;

  public constructor(userService: IUserService, errorService: IErrorService, eventService: IEventService) {
    super(errorService);
    this.userService = userService;
    this.eventService = eventService;
  }

  public async consumeMessage(message: Message): Promise<void> {
    switch (message.key.toString()) {
      case 'UserCreated':
        if (!this.checkVersion('1', message)) {
          return this.createError(message);
        }
        await Promise.all([this.userService.create(message.value), this.eventService.create(message)]);
        break;
      case 'UserUpdated':
        if (!this.checkVersion('1', message)) {
          return this.createError(message);
        }
        await Promise.all([this.userService.update(message.value), this.eventService.create(message)]);
        break;
      case 'UserDeleted':
        if (!this.checkVersion('1', message)) {
          return this.createError(message);
        }
        await Promise.all([this.userService.delete(message.value), this.eventService.create(message)]);
        break;
      default:
        return;
    }
  }
}
