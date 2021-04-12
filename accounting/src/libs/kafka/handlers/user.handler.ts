import { Message } from 'kafkajs';
import { IErrorService } from '../../../resources/errors/interfaces/errorService.interface';
import { IUserService } from '../../../resources/users/interfaces/userService.interface';
import { Handler } from './abstractHandler';

export class UserHandler extends Handler {
  private userService: IUserService;

  public constructor(userService: IUserService, errorService: IErrorService) {
    super(errorService);
    this.userService = userService;
  }

  public async consumeMessage(message: Message): Promise<void> {
    switch (message.key.toString()) {
      case 'UserCreated':
        if (!this.checkVersion('1', message)) {
          return this.createError(message);
        }
        await this.userService.create(message.value);
        break;
      case 'UserUpdated':
        if (!this.checkVersion('1', message)) {
          return this.createError(message);
        }
        await this.userService.update(message.value);
        break;
      case 'UserDeleted':
        if (!this.checkVersion('1', message)) {
          return this.createError(message);
        }
        await this.userService.delete(message.value);
        break;
      default:
        return;
    }
  }
}
