import 'dotenv/config';
import App from './app';
import { TaskRoute } from './resources/tasks/task.route';
import validateEnv from './utils/validateEnv';
import { registerBullConsumers } from './libs/bull/bull.consumers';
import { initializeKafkaConsumer } from './libs/kafka/kafka.config';

validateEnv();

const app = new App([new TaskRoute()]);

app.listen();

initializeKafkaConsumer();

registerBullConsumers();
