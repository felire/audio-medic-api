export default {
  NODE_ENV: 'production',
  PORT: process.env.PORT || 3000,
  
  // Database Configuration
  DB_HOST: process.env.DB_HOST || 'production-db-host',
  DB_PORT: parseInt(process.env.DB_PORT || '5432'),
  DB_USER: process.env.DB_USER || 'postgres',
  DB_PASSWORD: process.env.DB_PASSWORD || 'secure-password',
  DB_NAME: process.env.DB_NAME || 'audio_medic_prod'
}; 