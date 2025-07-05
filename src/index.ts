import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import sequelize from './config/database';
import config from './config/env';
import authRoutes from './routes/authRoutes';
import medicRoutes from './routes/medicRoutes';
import patientRoutes from './routes/patientRoutes';
import soapNoteRoutes from './routes/soapNoteRoutes';

// Inicializar express
const app = express();
const PORT = config.PORT;

// Configuración de CORS
const corsOptions = {
  origin: config.NODE_ENV === 'production' 
    ? 'https://tu-dominio-de-produccion.com' 
    : 'http://localhost:3000', // Ajustar al puerto de tu frontend
  credentials: true, // Permitir cookies
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

// Middlewares
app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas
app.use('/api/auth', authRoutes);
app.use('/api/medics', medicRoutes);
app.use('/api/patients', patientRoutes);
app.use('/api/soap-notes', soapNoteRoutes);

// Ruta base
app.get('/', (_req, res) => {
  res.send(`API de Audio-Medic con PostgreSQL y Sequelize (Ambiente: ${config.NODE_ENV})`);
});

// Sincronizar base de datos y levantar servidor
const startServer = async () => {
  try {
    // En producción, es posible que no quieras forzar la sincronización
    // { force: true } elimina y recrea las tablas (útil en desarrollo)
    // alter: true actualiza las tablas si es necesario
    await sequelize.sync({ force: config.NODE_ENV === 'development', alter: true });
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
