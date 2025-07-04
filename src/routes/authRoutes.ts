import { Router } from 'express';
import AuthController from '../controllers/AuthController';
import { registerValidator, loginValidator, changePasswordValidator } from '../validators/auth';
import { authenticate } from '../middlewares/auth';

const router = Router();

// POST /auth/register - Registro de médicos
router.post('/register', registerValidator, AuthController.register);

// POST /auth/login - Iniciar sesión
router.post('/login', loginValidator, AuthController.login);

// POST /auth/refresh-token - Renovar el access token
router.post('/refresh-token', AuthController.refreshToken);

// POST /auth/logout - Cerrar sesión
router.post('/logout', AuthController.logout);

// GET /auth/profile - Obtener perfil del médico autenticado
router.get('/profile', authenticate, AuthController.getProfile);

// PUT /auth/change-password - Cambiar contraseña
router.put('/change-password', authenticate, changePasswordValidator, AuthController.changePassword);

export default router; 