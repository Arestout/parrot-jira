import { TaskRepository } from '../../../resources/tasks/task.repository';
import { TaskService } from '../../../resources/tasks/task.service';
import { KafkaProducer } from '../kafka.producer';

const tasksRepository = new TaskRepository();
const kafkaProducer = new KafkaProducer();
const taskService = new TaskService(tasksRepository, kafkaProducer);

export const taskHandler = async message => {
  const { event_version } = message.headers;

  if (event_version.toString() !== '1') {
    throw new Error('Unsupported version');
  }

  switch (message.key.toString()) {
    case 'TaskCreated':
      return await taskService.create(message.value);
    default:
      return;
  }
};
