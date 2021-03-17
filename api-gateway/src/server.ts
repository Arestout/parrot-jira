import 'dotenv/config';
import App from './app';
import { UserRoute } from './resources/users/user.route';
import { AuthRoute } from './resources/auth/auth.route';
import { TaskRoute } from './resources/tasks/task.route';
import validateEnv from './utils/validateEnv';

validateEnv();

const app = new App([new UserRoute(), new AuthRoute(), new TaskRoute()]);

app.listen();
