import 'dotenv/config';
import App from './app';
import { TaskRoute } from './resources/tasks/task.route';
import validateEnv from './utils/validateEnv';

validateEnv();

const app = new App([new TaskRoute()]);

app.listen();
