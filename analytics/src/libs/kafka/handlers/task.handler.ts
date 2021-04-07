import { TaskRepository } from '../../../resources/tasks/task.repository';
import { TaskService } from '../../../resources/tasks/task.service';

const tasksRepository = new TaskRepository();
const taskService = new TaskService(tasksRepository);

export const taskHandler = async message => {
  const { event_version } = message.headers;

  if (event_version.toString() !== '1') {
    throw new Error('Unsupported version');
  }

  switch (message.key.toString()) {
    case 'TaskCreated':
      return await taskService.create(message.value);
    case 'TaskValueSet':
      return await taskService.update(message.value);
    case 'TaskCompleted':
      return await taskService.update(message.value);
    default:
      return;
  }
};
