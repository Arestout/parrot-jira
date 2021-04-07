import { Message } from 'kafkajs';
import { ErrorRepository } from '../../../resources/errors/error.repository';
import { ErrorService } from '../../../resources/errors/error.service';
import { UserRepository } from '../../../resources/users/user.repository';
import { UserService } from '../../../resources/users/user.service';

const userService = new UserService(new UserRepository());

const errorRepository = new ErrorRepository();
const errorService = new ErrorService(errorRepository);

export const userHandler = async message => {
  const { event_version } = message.headers;

  const checkVersion = (version: string) => version === event_version.toString();

  const createError = async (message: Message) => {
    const error = await errorService.create(message);
    throw new Error(`Unsupported version. Error id: ${error.id}`);
  };

  switch (message.key.toString()) {
    case 'UserCreated':
      if (!checkVersion('1')) {
        return createError(message);
      }
      return await userService.create(message.value);
    case 'UserUpdated':
      if (!checkVersion('1')) {
        return createError(message);
      }
      return await userService.update(message.value);
    case 'UserDeleted':
      if (!checkVersion('1')) {
        return createError(message);
      }
      return await userService.delete(message.value);
    default:
      return;
  }
};
