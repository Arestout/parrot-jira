import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import hpp from 'hpp';
import morgan from 'morgan';
import DB from './database';

import errorMiddleware from './middlewares/error.middleware';
import { logger, stream } from './utils/logger';
import { Route } from './interfaces/routes.interface';
import { PORT, NODE_ENV } from './config';
import { createProxyMiddleware } from 'http-proxy-middleware';
import authMiddleware from './middlewares/auth.middleware';
class App {
  public app: express.Application;
  public port: string | number;
  public env: string;

  constructor(routes: Route[]) {
    this.app = express();
    this.port = PORT;
    this.env = NODE_ENV;

    this.connectToDatabase();
    this.initializeProxyRoutes();
    this.initializeMiddlewares();
    this.initializeRoutes(routes);
    this.initializeErrorHandling();
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
      this.app.use(cors({ origin: true, credentials: true }));
    } else if (this.env === 'development') {
      this.app.use(morgan('dev', { stream }));
      this.app.use(cors({ origin: true, credentials: true }));
    }

    this.app.use(hpp());
    this.app.use(helmet());
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(cookieParser());
  }

  private initializeRoutes(routes: Route[]) {
    routes.forEach(route => {
      this.app.use('/', route.router);
    });
  }

  private initializeProxyRoutes() {
    this.app.use('/tasks', [authMiddleware, createProxyMiddleware({ target: 'http://task-tracker:3001', changeOrigin: true })]);
  }

  private initializeErrorHandling() {
    this.app.use(errorMiddleware);
  }
}

export default App;
