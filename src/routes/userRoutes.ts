import { Router } from 'express';
import UserController from '../controllers/UserController';

const router = Router();

// GET /users - Obtener todos los usuarios
router.get('/', UserController.getAllUsers);

// GET /users/:id - Obtener un usuario específico
router.get('/:id', UserController.getUser);

// POST /users - Crear un nuevo usuario
router.post('/', UserController.createUser);

// PUT /users/:id - Actualizar un usuario existente
router.put('/:id', UserController.updateUser);

// DELETE /users/:id - Eliminar un usuario
router.delete('/:id', UserController.deleteUser);

export default router; 