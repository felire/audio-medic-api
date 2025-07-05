import { Router } from 'express';
import SoapNoteController from '../controllers/SoapNoteController';
import { authenticate } from '../middlewares/auth';
import { body } from 'express-validator';

const router = Router();

// Validadores
const soapNoteValidator = [
  body('patient_id').isNumeric().withMessage('Patient ID is required'),
  body('id_note_type').isNumeric().withMessage('Note type ID is required'),
  body('content').isString().notEmpty().withMessage('Content is required')
];

const updateSoapNoteValidator = [
  body('content').isString().notEmpty().withMessage('Content is required')
];

// GET /soap-notes - Obtener todas las notas SOAP (solo para médicos autenticados)
router.get('/', authenticate, SoapNoteController.getAllSoapNotes.bind(SoapNoteController));

// GET /soap-notes/:id - Obtener una nota SOAP específica
router.get('/:id', authenticate, SoapNoteController.getSoapNoteById.bind(SoapNoteController));

// POST /soap-notes - Crear una nueva nota SOAP
router.post('/', authenticate, soapNoteValidator, SoapNoteController.createSoapNote.bind(SoapNoteController));

// PUT /soap-notes/:id - Actualizar una nota SOAP existente
router.put('/:id', authenticate, updateSoapNoteValidator, SoapNoteController.updateSoapNote.bind(SoapNoteController));

// DELETE /soap-notes/:id - Eliminar una nota SOAP
router.delete('/:id', authenticate, SoapNoteController.deleteSoapNote.bind(SoapNoteController));

// PUT /soap-notes/:id/sign - Firmar una nota SOAP
router.put('/:id/sign', authenticate, SoapNoteController.signSoapNote.bind(SoapNoteController));

// GET /soap-notes/patient/:patientId - Obtener notas SOAP de un paciente para el médico autenticado
router.get('/patient/:patientId', authenticate, SoapNoteController.getSoapNotesByPatient.bind(SoapNoteController));

// GET /soap-notes/patient-medic/:patientMedicId - Obtener notas SOAP de una relación médico-paciente (para compatibilidad)
router.get('/patient-medic/:patientMedicId', authenticate, SoapNoteController.getSoapNotesByPatientMedic.bind(SoapNoteController));

export default router; 