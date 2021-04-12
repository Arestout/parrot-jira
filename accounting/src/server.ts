import 'dotenv/config';
import App from './app';
import validateEnv from './utils/validateEnv';
import { AccountRoute } from './resources/accounts/account.route';
import { registerBullConsumers } from './libs/bull/bull.consumers';
import { initializeKafkaConsumer } from './libs/kafka/kafka.config';

validateEnv();

const app = new App([new AccountRoute()]);

app.listen();

initializeKafkaConsumer();

registerBullConsumers();
