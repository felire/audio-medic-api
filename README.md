# Audio-Medic API

API para el proyecto Audio-Medic con Express, TypeScript, PostgreSQL y Sequelize.

## Estructura del proyecto

```
src/
  ├── config/        # Configuración de la base de datos
  │   └── env/       # Configuraciones específicas por entorno
  ├── controllers/   # Controladores de la API
  ├── models/        # Modelos de Sequelize
  ├── repositories/  # Repositorios para acceso a la base de datos
  ├── routes/        # Rutas de la API
  ├── types/         # Tipos personalizados
  └── index.ts       # Punto de entrada de la aplicación
```

## Requisitos

- Node.js (v14 o superior)
- PostgreSQL
- npm o yarn

## Instalación

1. Clonar el repositorio
2. Instalar dependencias:

```bash
npm install
```

3. Configurar la base de datos

El proyecto ya incluye configuración para diferentes entornos (desarrollo, staging, producción).
Para desarrollo, se utilizará la siguiente configuración por defecto:

```
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=audio_medic
```

4. Iniciar el servidor:

### Para desarrollo

```bash
npm run dev
```

### Para staging

```bash
npm run staging
```

### Para producción

```bash
npm run build
npm start
```

## Base de datos Docker

Puedes iniciar rápidamente una base de datos PostgreSQL con Docker:

```bash
docker run --name audio-medic \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=audio_medic \
  -p 5432:5432 \
  -d postgres
```

## Configuración de entornos

La aplicación usa diferentes configuraciones según el entorno:

- **Desarrollo**: `src/config/env/development.config.ts`
- **Staging**: `src/config/env/staging.config.ts`
- **Producción**: `src/config/env/production.config.ts`

Para modificar la configuración de cualquier entorno, edita el archivo correspondiente.

## Scripts disponibles

- `npm run dev`: Inicia el servidor en modo desarrollo con hot-reload
- `npm run build`: Compila el código TypeScript a JavaScript
- `npm start`: Inicia el servidor desde la versión compilada

## Dependencias necesarias

Para instalar todas las dependencias necesarias:

```bash
npm install sequelize pg pg-hstore dotenv
npm install -D @types/sequelize
``` 