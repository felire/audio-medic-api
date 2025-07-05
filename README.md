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

## API Endpoints

La API proporciona los siguientes endpoints:

### Autenticación (`/api/auth`)

| Método | Endpoint | Descripción | Autenticación | Parámetros |
|--------|----------|-------------|---------------|------------|
| POST | `/api/auth/register` | Registra un nuevo médico | No | `email`, `password`, `name`, `specialty` |
| POST | `/api/auth/login` | Inicia sesión y devuelve tokens | No | `email`, `password` |
| POST | `/api/auth/refresh-token` | Renueva el token de acceso usando un refresh token | No | Cookie `refresh_token` o `refreshToken` en el body |
| POST | `/api/auth/logout` | Cierra la sesión y revoca el token | No | Cookie `refresh_token` o `refreshToken` en el body |
| GET | `/api/auth/profile` | Obtiene el perfil del médico autenticado | Sí | - |
| PUT | `/api/auth/change-password` | Cambia la contraseña del médico autenticado | Sí | `currentPassword`, `newPassword` |

### Médicos (`/api/medics`)

| Método | Endpoint | Descripción | Autenticación | Parámetros |
|--------|----------|-------------|---------------|------------|
| GET | `/api/medics` | Obtiene todos los médicos | No | - |
| GET | `/api/medics/:id` | Obtiene un médico específico | No | `id` en URL |
| PUT | `/api/medics/:id` | Actualiza un médico existente | Sí (solo el propio médico) | `id` en URL, `name`, `email`, `specialty` en body |
| DELETE | `/api/medics/:id` | Elimina un médico | Sí (solo el propio médico) | `id` en URL |
| GET | `/api/medics/:id/patients` | Obtiene los pacientes de un médico | Sí (solo el propio médico) | `id` en URL |

### Pacientes (`/api/patients`)

| Método | Endpoint | Descripción | Autenticación | Parámetros |
|--------|----------|-------------|---------------|------------|
| GET | `/api/patients` | Obtiene todos los pacientes | Sí | - |
| GET | `/api/patients/:id` | Obtiene un paciente específico | Sí | `id` en URL |
| POST | `/api/patients` | Crea un nuevo paciente | Sí | `name`, `document`, `sex` ('M', 'F', 'O') |
| PUT | `/api/patients/:id` | Actualiza un paciente existente | Sí | `id` en URL, `name`, `document`, `sex` en body |
| DELETE | `/api/patients/:id` | Elimina un paciente | Sí | `id` en URL |
| GET | `/api/patients/:id/medics` | Obtiene los médicos de un paciente | Sí | `id` en URL |
| POST | `/api/patients/:patientId/assign` | Asigna un paciente al médico autenticado | Sí | `patientId` en URL |

### Notas SOAP (`/api/soap-notes`)

| Método | Endpoint | Descripción | Autenticación | Parámetros |
|--------|----------|-------------|---------------|------------|
| GET | `/api/soap-notes` | Obtiene todas las notas SOAP | Sí | - |
| GET | `/api/soap-notes/:id` | Obtiene una nota SOAP específica | Sí (solo el médico propietario) | `id` en URL |
| POST | `/api/soap-notes` | Crea una nueva nota SOAP | Sí | `patient_id`, `id_note_type`, `content` |
| PUT | `/api/soap-notes/:id` | Actualiza una nota SOAP existente | Sí (solo el médico propietario) | `id` en URL, `content` en body |
| DELETE | `/api/soap-notes/:id` | Elimina una nota SOAP | Sí (solo el médico propietario) | `id` en URL |
| PUT | `/api/soap-notes/:id/sign` | Firma una nota SOAP | Sí (solo el médico propietario) | `id` en URL |
| GET | `/api/soap-notes/patient/:patientId` | Obtiene notas SOAP de un paciente | Sí (solo el médico asignado) | `patientId` en URL |
| GET | `/api/soap-notes/patient-medic/:patientMedicId` | Obtiene notas SOAP de una relación médico-paciente | Sí (solo el médico asignado) | `patientMedicId` en URL |

## Detalles de los Parámetros

### Autenticación

#### Registro de médico
```json
{
  "email": "doctor@example.com",
  "password": "contraseña123",
  "name": "Dr. Juan Pérez",
  "specialty": "Cardiología"
}
```

#### Login
```json
{
  "email": "doctor@example.com",
  "password": "contraseña123"
}
```

#### Cambio de contraseña
```json
{
  "currentPassword": "contraseña123",
  "newPassword": "nuevaContraseña456"
}
```

### Pacientes

#### Crear/Actualizar paciente
```json
{
  "name": "María García",
  "document": "12345678",
  "sex": "F"  // M (masculino), F (femenino), O (otro)
}
```

### Notas SOAP

#### Crear nota SOAP
```json
{
  "patient_id": 1,
  "id_note_type": 1,
  "content": "El paciente presenta síntomas de..."
}
```

#### Actualizar nota SOAP
```json
{
  "content": "El paciente presenta síntomas de... [actualizado]"
}
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