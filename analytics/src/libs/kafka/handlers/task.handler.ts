import { Message } from 'kafkajs';
import { ErrorRepository } from '../../../resources/errors/error.repository';
import { ErrorService } from '../../../resources/errors/error.service';
import { TaskRepository } from '../../../resources/tasks/task.repository';
import { TaskService } from '../../../resources/tasks/task.service';

const tasksRepository = new TaskRepository();
const taskService = new TaskService(tasksRepository);

const errorRepository = new ErrorRepository();
const errorService = new ErrorService(errorRepository);

export const taskHandler = async message => {
  const { event_version } = message.headers;

  const checkVersion = (version: string) => version === event_version.toString();

  const createError = async (message: Message) => {
    const error = await errorService.create(message);
    throw new Error(`Unsupported version. Error id: ${error.id}`);
  };

  switch (message.key.toString()) {
    case 'TaskCreated':
      if (!checkVersion('1')) {
        return createError(message);
      }
      return await taskService.create(message.value);
    case 'TaskValueSet':
      if (!checkVersion('1')) {
        return createError(message);
      }
      return await taskService.update(message.value);
    case 'TaskCompleted':
      if (!checkVersion('1')) {
        return createError(message);
      }
      return await taskService.update(message.value);
    default:
      return;
  }
};
