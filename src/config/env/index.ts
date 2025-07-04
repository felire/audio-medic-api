import developmentConfig from './development.config';
import stagingConfig from './staging.config';
import productionConfig from './production.config';

type Environment = 'development' | 'staging' | 'production';

// Determinar el entorno actual
const env = (process.env.NODE_ENV as Environment) || 'development';

// Seleccionar la configuración adecuada según el entorno
const configs = {
  development: developmentConfig,
  staging: stagingConfig,
  production: productionConfig
};

const config = configs[env];

export default config; 