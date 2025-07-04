import { Router } from 'express';
import MedicController from '../controllers/MedicController';
import { authenticate } from '../middlewares/auth';

const router = Router();

// GET /medics - Obtener todos los médicos
router.get('/', MedicController.getAllMedics);

// GET /medics/:id - Obtener un médico específico
router.get('/:id', MedicController.getMedicById);

// POST /medics - Crear un nuevo médico
router.post('/', authenticate, MedicController.createMedic);

// PUT /medics/:id - Actualizar un médico existente
router.put('/:id', authenticate, MedicController.updateMedic);

// DELETE /medics/:id - Eliminar un médico
router.delete('/:id', authenticate, MedicController.deleteMedic);

// GET /medics/:id/patients - Obtener pacientes de un médico
router.get('/:id/patients', authenticate, MedicController.getMedicPatients);

export default router; 