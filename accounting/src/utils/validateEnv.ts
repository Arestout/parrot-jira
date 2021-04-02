import { cleanEnv, port, str } from 'envalid';

function validateEnv() {
  cleanEnv(process.env, {
    NODE_ENV: str({ choices: ['development', 'test', 'production'] }),
    PORT: port(),
    POSTGRES_USER: str(),
    POSTGRES_PASSWORD: str(),
    POSTGRES_HOST: str(),
    POSTGRES_DB: str(),
    USER_TOPIC: str(),
    TASK_TOPIC: str(),
    TASK_STATUS_TOPIC: str(),
  });
}

export default validateEnv;
