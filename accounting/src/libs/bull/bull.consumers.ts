import { sendPayment } from '../cron/sendPayment.cron';
import { notificationQueueHandler } from '../notification/queueHandler';
import { notificationQueue, paymentsQueue } from './bull.config';

export const registerBullConsumers = () => {
  paymentsQueue.process(async () => {
    return await sendPayment();
  });

  notificationQueue.process(async job => {
    return await notificationQueueHandler(job.data);
  });
};
