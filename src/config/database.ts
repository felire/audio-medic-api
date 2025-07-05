import { Sequelize } from 'sequelize';
import config from './env';

const sequelize = new Sequelize(
  config.DB_URL,
  {
    dialect: 'postgres',
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