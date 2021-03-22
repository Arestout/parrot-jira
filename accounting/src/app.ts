import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import hpp from 'hpp';
import morgan from 'morgan';
import DB from './database';
import { Consumer } from 'kafkajs';

import errorMiddleware from './middlewares/error.middleware';
import { logger, stream } from './utils/logger';
import { Routes } from './interfaces/routes.interface';
import { PORT, NODE_ENV } from './config';
import { kafka } from './libs/kafka/kafka.config';
import { KafkaConsumer } from './libs/kafka/kafka.consumer';

class App {
  public app: express.Application;
  public port: string | number;
  public env: string;

  constructor(routes: Routes[]) {
    this.app = express();
    this.port = PORT;
    this.env = NODE_ENV;

    this.connectToDatabase();
    this.initializeMiddlewares();
    this.initializeRoutes(routes);
    this.initializeErrorHandling();
    this.initializeKafkaConsumer();
  }

  public listen() {
    this.app.listen(this.port, () => {
      logger.info(`🚀 App listening on the port ${this.port}`);
    });
  }

  public getServer() {
    return this.app;
  }

  private connectToDatabase() {
    DB.sequelize.sync({ force: false });
  }

  private initializeMiddlewares() {
    if (this.env === 'production') {
      this.app.use(morgan('combined', { stream }));
      this.app.use(cors({ origin: 'your.domain.com', credentials: true }));
    } else if (this.env === 'development') {
      this.app.use(morgan('dev', { stream }));
      this.app.use(cors({ origin: true }));
    }

    this.app.use(hpp());
    this.app.use(helmet());
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
  }

  private initializeRoutes(routes: Routes[]) {
    routes.forEach(route => {
      this.app.use('/', route.router);
    });
  }

  private initializeKafkaConsumer() {
    const consumer: Consumer = kafka.consumer({ groupId: 'accounting-group' });
    const kafkaConsumer = new KafkaConsumer(consumer);

    (async function () {
      await kafkaConsumer.subscribe({ topic: 'user-topic', fromBeginning: true });
      await kafkaConsumer.receiveMessages('users');

      // await kafkaConsumer.subscribe({ topic: 'task-topic', fromBeginning: true });
      // await kafkaConsumer.receiveMessages('tasks');
    })();
  }
  private initializeErrorHandling() {
    this.app.use(errorMiddleware);
  }
}

export default App;
