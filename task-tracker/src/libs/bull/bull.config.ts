import Queue from 'bull';

import { REDIS_HOST } from '../../config';

export const notificationQueue = new Queue('task-tracker-service-notifications', { redis: REDIS_HOST });
