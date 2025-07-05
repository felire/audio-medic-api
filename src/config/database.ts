import { Sequelize } from 'sequelize';
import config from './env';

const sequelize = new Sequelize(
  'postgresql://neondb_owner:npg_L8QBqKUJ7HbT@ep-wispy-credit-acjpzm2z-pooler.sa-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require',
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