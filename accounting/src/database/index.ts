import Sequelize from 'sequelize';
import { dbConfig } from '../config';
import { logger } from '../utils/logger';
import { NODE_ENV } from './../config/index';
import TaskModel from './../resources/tasks/task.model';
import UserModel from '../resources/users/user.model';
import AccountModel from '../resources/accounts/account.model';
import TransactionModel from '../resources/transactions/transaction.model';
import PaymentModel from '../resources/payments/payment.model';

const env = NODE_ENV;
const sequelize = new Sequelize.Sequelize(dbConfig[env].database, dbConfig[env].username, dbConfig[env].password, {
  host: dbConfig[env].host,
  dialect: dbConfig[env].dialect,
  timezone: '+09:00',
  define: {
    charset: 'utf8mb4',
    collate: 'utf8mb4_general_ci',
    underscored: true,
    freezeTableName: true,
  },
  pool: dbConfig[env].pool,
  logQueryParameters: env === 'development',
  logging: (query, time) => {
    logger.info(time + 'ms' + ' ' + query);
  },
  benchmark: true,
});

sequelize
  .authenticate()
  .then(() => {
    logger.info('🟢 The database is connected.');
  })
  .catch((error: Error) => {
    logger.error(`🔴 Unable to connect to the database: ${error}.`);
  });

const DB = {
  Tasks: TaskModel(sequelize),
  Users: UserModel(sequelize),
  Accounts: AccountModel(sequelize),
  Transactions: TransactionModel(sequelize),
  Payments: PaymentModel(sequelize),
  sequelize, // connection instance (RAW queries)
  Sequelize, // library
};

Object.keys(DB).forEach(modelName => {
  if (DB[modelName].associate) {
    DB[modelName].associate(DB);
  }
});

export default DB;
