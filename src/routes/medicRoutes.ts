import { Router } from 'express';
import MedicController from '../controllers/MedicController';
import { authenticate, checkSelfOrAdmin } from '../middlewares/auth';

const router = Router();

// GET /medics - Obtener todos los médicos
router.get('/', MedicController.getAllMedics.bind(MedicController));

// GET /medics/:id - Obtener un médico específico
router.get('/:id', MedicController.getMedicById.bind(MedicController));

// POST /medics - Crear un nuevo médico (solo disponible para usuarios no autenticados - registro)
// Esta ruta se maneja a través de authRoutes.ts con el método register

// PUT /medics/:id - Actualizar un médico existente (solo puede actualizar su propio perfil)
router.put('/:id', authenticate, checkSelfOrAdmin, MedicController.updateMedic.bind(MedicController));

// DELETE /medics/:id - Eliminar un médico (solo puede eliminarse a sí mismo)
router.delete('/:id', authenticate, checkSelfOrAdmin, MedicController.deleteMedic.bind(MedicController));

// GET /medics/:id/patients - Obtener pacientes de un médico (solo puede ver sus propios pacientes)
router.get('/:id/patients', authenticate, checkSelfOrAdmin, MedicController.getMedicPatients.bind(MedicController));

export default router; 