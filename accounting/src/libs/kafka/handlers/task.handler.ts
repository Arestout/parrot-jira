import { Message } from 'kafkajs';
import { ITaskService } from '../../../resources/tasks/interfaces/taskService.interface';

export const taskHandler = async (taskService: ITaskService, message: Message) => {
  switch (message.key.toString()) {
    case 'TaskCreated':
      return await taskService.create(JSON.parse(message.value.toString()));
    default:
      return;
  }
};
