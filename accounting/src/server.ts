import 'dotenv/config';
import App from './app';
import validateEnv from './utils/validateEnv';
import { AccountRoute } from './resources/accounts/account.route';

validateEnv();

const app = new App([new AccountRoute()]);

app.listen();
