import Queue from 'bull';

import { REDIS_HOST } from '../../config';

export const notificationQueue = new Queue('accounting-service-notifications', { redis: REDIS_HOST });
export const paymentsQueue = new Queue('accounting-service-payments', { redis: REDIS_HOST });
