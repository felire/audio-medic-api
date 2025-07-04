import express from 'express';
import sequelize from './config/database';
import userRoutes from './routes/userRoutes';
import config from './config/env';

const app = express();
const PORT = config.PORT;

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas
app.use('/api/users', userRoutes);

// Ruta base
app.get('/', (_req, res) => {
  res.send(`API de Audio-Medic con PostgreSQL y Sequelize (Ambiente: ${config.NODE_ENV})`);
});

// Sincronizar base de datos y levantar servidor
const startServer = async () => {
  try {
    // En producción, es posible que no quieras forzar la sincronización
    // { force: true } elimina y recrea las tablas (útil en desarrollo)
    await sequelize.sync({ force: config.NODE_ENV === 'development' });
    console.log('Base de datos sincronizada correctamente');

    app.listen(PORT, () => {
      console.log(`Servidor corriendo en http://localhost:${PORT} (${config.NODE_ENV})`);
      console.log(`Conectado a la base de datos: ${config.DB_NAME} en ${config.DB_HOST}`);
    });
  } catch (error) {
    console.error('Error al iniciar el servidor:', error);
    process.exit(1);
  }
};

startServer();
