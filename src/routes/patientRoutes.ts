import { Router } from 'express';
import PatientController from '../controllers/PatientController';
import { authenticate } from '../middlewares/auth';
import { body } from 'express-validator';

const router = Router();

// Validadores
const patientValidator = [
  body('name').isString().notEmpty().withMessage('Name is required'),
  body('document').isString().notEmpty().withMessage('Document is required'),
  body('sex').isIn(['M', 'F', 'O']).withMessage('Sex must be M, F, or O')
];

// GET /patients - Obtener todos los pacientes (solo médicos autenticados)
router.get('/', authenticate, PatientController.getAllPatients.bind(PatientController));

// GET /patients/:id - Obtener un paciente específico
router.get('/:id', authenticate, PatientController.getPatientById.bind(PatientController));

// POST /patients - Crear un nuevo paciente
router.post('/', authenticate, patientValidator, PatientController.createPatient.bind(PatientController));

// PUT /patients/:id - Actualizar un paciente existente
router.put('/:id', authenticate, patientValidator, PatientController.updatePatient.bind(PatientController));

// DELETE /patients/:id - Eliminar un paciente
router.delete('/:id', authenticate, PatientController.deletePatient.bind(PatientController));

// GET /patients/:id/medics - Obtener médicos de un paciente
router.get('/:id/medics', authenticate, PatientController.getPatientMedics.bind(PatientController));

// POST /patients/:patientId/assign - Asignar un paciente al médico autenticado
router.post('/:patientId/assign', authenticate, PatientController.assignPatientToMedic.bind(PatientController));

export default router; 