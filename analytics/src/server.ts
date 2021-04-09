import 'dotenv/config';
import App from './app';
import validateEnv from './utils/validateEnv';
import { TaskRoute } from './resources/tasks/task.route';
import { initializeKafkaConsumer } from './libs/kafka/kafka.config';

validateEnv();

const app = new App([new TaskRoute()]);

app.listen();

initializeKafkaConsumer();
