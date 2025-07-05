import { Router } from 'express';
import MedicController from '../controllers/MedicController';
import { authenticate } from '../middlewares/auth';

const router = Router();

// GET /medics - Obtener todos los médicos
router.get('/', MedicController.getAllMedics.bind(MedicController));

// GET /medics/:id - Obtener un médico específico
router.get('/:id', MedicController.getMedicById.bind(MedicController));

// POST /medics - Crear un nuevo médico
router.post('/', authenticate, MedicController.createMedic.bind(MedicController));

// PUT /medics/:id - Actualizar un médico existente
router.put('/:id', authenticate, MedicController.updateMedic.bind(MedicController));

// DELETE /medics/:id - Eliminar un médico
router.delete('/:id', authenticate, MedicController.deleteMedic.bind(MedicController));

// GET /medics/:id/patients - Obtener pacientes de un médico
router.get('/:id/patients', authenticate, MedicController.getMedicPatients.bind(MedicController));

export default router; 