export const dbConfig = {
  development: {
    username: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB,
    host: process.env.POSTGRES_HOST,
    dialect: 'postgres',
  },
  test: {
    username: 'root',
    password: 'password',
    database: 'postgres',
    host: 'postgresql',
    dialect: 'postgres',
  },
  production: {
    username: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB,
    host: process.env.POSTGRES_HOST,
    dialect: 'postgres',
  },
};

export const PORT = process.env.PORT || 3003;
export const NODE_ENV = process.env.NODE_ENV || 'development';
export const REDIS_HOST = process.env.REDIS_HOST;
export const JWT_SECRET = process.env.JWT_SECRET;
export const HOST_IP = process.env.HOST_IP;

export const USER_TOPIC = process.env.USER_TOPIC;
