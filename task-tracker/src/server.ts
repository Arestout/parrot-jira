import 'dotenv/config';
import App from './app';
import { TaskRoute } from './resources/tasks/task.route';
import validateEnv from './utils/validateEnv';
import { registerBullConsumers } from './libs/bull/bull.consumers';

validateEnv();

const app = new App([new TaskRoute()]);

app.listen();

registerBullConsumers();
