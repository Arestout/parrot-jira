import { notificationQueueHandler } from '../notification/queueHandler';
import { notificationQueue } from './bull.config';

export const registerBullConsumers = () => {
  notificationQueue.process(async job => {
    return await notificationQueueHandler(job.data);
  });
};
