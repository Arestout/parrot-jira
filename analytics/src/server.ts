import 'dotenv/config';
import App from './app';
import validateEnv from './utils/validateEnv';
import { TaskRoute } from './resources/tasks/task.route';

validateEnv();

const app = new App([new TaskRoute()]);

app.listen();
