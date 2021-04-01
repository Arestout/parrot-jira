import { UserRepository } from '../../../resources/users/user.repository';
import { UserService } from '../../../resources/users/user.service';

const userService = new UserService(new UserRepository());

export const userHandler = async message => {
  const { event_version } = message.headers;

  if (event_version.toString() !== '1') {
    throw new Error('Unsupported version');
  }

  switch (message.key.toString()) {
    case 'UserCreated':
      return await userService.create(message.value);
    case 'UserUpdated':
      return await userService.update(message.value);
    case 'UserDeleted':
      return await userService.delete(message.value);
    default:
      return;
  }
};
