import { Sequelize } from 'sequelize';
import config from './env';

const sequelize = new Sequelize(
  config.DB_NAME,
  config.DB_USER,
  config.DB_PASSWORD,
  {
    host: config.DB_HOST,
    dialect: 'postgres',
    port: config.DB_PORT,
    logging: config.NODE_ENV !== 'production',
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  }
);

export default sequelize; 