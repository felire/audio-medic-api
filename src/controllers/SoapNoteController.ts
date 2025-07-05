import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import SoapNoteRepository from '../repositories/SoapNoteRepository';
import PatientMedicRepository from '../repositories/PatientMedicRepository';
import PatientRepository from '../repositories/PatientRepository';

class SoapNoteController {
  // Obtener todas las notas SOAP
  async getAllSoapNotes(_req: Request, res: Response): Promise<void> {
    try {
      const soapNotes = await SoapNoteRepository.getAll();
      res.status(200).json({
        success: true,
        data: soapNotes
      });
    } catch (error) {
      console.error('Error getting SOAP notes:', error);
      res.status(500).json({
        success: false,
        message: 'Error retrieving SOAP notes',
        error: 'SERVER_ERROR'
      });
    }
  }

  // Obtener una nota SOAP por ID
  async getSoapNoteById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const soapNote = await SoapNoteRepository.getDetailedById(Number(id));
      
      if (!soapNote) {
        res.status(404).json({
          success: false,
          message: `SOAP note with id ${id} not found`,
          error: 'NOTE_NOT_FOUND'
        });
        return;
      }
      
      // Verificar que el médico que solicita la nota sea el propietario
      if (req.user && req.user.id !== soapNote.patientMedic.medic.id) {
        res.status(403).json({
          success: false,
          message: 'You do not have permission to access this note',
          error: 'FORBIDDEN'
        });
        return;
      }
      
      res.status(200).json({
        success: true,
        data: soapNote
      });
    } catch (error) {
      console.error(`Error getting SOAP note:`, error);
      res.status(500).json({
        success: false,
        message: 'Error retrieving SOAP note',
        error: 'SERVER_ERROR'
      });
    }
  }

  // Crear una nueva nota SOAP
  async createSoapNote(req: Request, res: Response): Promise<void> {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({
          success: false,
          errors: errors.array()
        });
        return;
      }

      const { patient_id, id_note_type, content } = req.body;
      const medicId = req.user!.id;
      
      // Verificar que el paciente exista
      const patient = await PatientRepository.getById(patient_id);
      if (!patient) {
        res.status(404).json({
          success: false,
          message: 'Patient not found',
          error: 'PATIENT_NOT_FOUND'
        });
        return;
      }
      
      // Buscar la relación médico-paciente existente o crearla si no existe
      let patientMedic = await PatientMedicRepository.getByMedicAndPatient(medicId, patient_id);
      
      if (!patientMedic) {
        // Crear una nueva relación médico-paciente
        patientMedic = await PatientMedicRepository.create({
          medic_id: medicId,
          patient_id: patient_id,
          date_first_consultant: new Date()
        });
        
        if (!patientMedic) {
          res.status(500).json({
            success: false,
            message: 'Failed to create patient-medic relationship',
            error: 'RELATION_CREATION_FAILED'
          });
          return;
        }
      }
      
      // Crear la nota SOAP con el patient_medic_id obtenido
      const soapNote = await SoapNoteRepository.create({
        patient_medic_id: patientMedic.id,
        id_note_type,
        content,
        date_created: new Date()
      });
      
      res.status(201).json({
        success: true,
        data: soapNote,
        message: 'SOAP note created successfully'
      });
    } catch (error) {
      console.error('Error creating SOAP note:', error);
      res.status(500).json({
        success: false,
        message: 'Error creating SOAP note',
        error: 'SERVER_ERROR'
      });
    }
  }

  // Actualizar una nota SOAP existente
  async updateSoapNote(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const errors = validationResult(req);
      
      if (!errors.isEmpty()) {
        res.status(400).json({
          success: false,
          errors: errors.array()
        });
        return;
      }
      
      // Obtener la nota existente
      const existingNote = await SoapNoteRepository.getDetailedById(Number(id));
      if (!existingNote) {
        res.status(404).json({
          success: false,
          message: `SOAP note with id ${id} not found`,
          error: 'NOTE_NOT_FOUND'
        });
        return;
      }
      
      // Verificar que el médico que actualiza la nota sea el propietario
      if (req.user && req.user.id !== existingNote.patientMedic.medic.id) {
        res.status(403).json({
          success: false,
          message: 'You do not have permission to update this note',
          error: 'FORBIDDEN'
        });
        return;
      }
      
      // No permitir actualizar una nota firmada
      if (existingNote.signed) {
        res.status(400).json({
          success: false,
          message: 'Cannot update a signed note',
          error: 'NOTE_SIGNED'
        });
        return;
      }
      
      // Marcar la nota como editada
      const updatedData = {
        ...req.body,
        edited: true
      };
      
      const soapNote = await SoapNoteRepository.update(Number(id), updatedData);
      
      res.status(200).json({
        success: true,
        data: soapNote,
        message: 'SOAP note updated successfully'
      });
    } catch (error) {
      console.error(`Error updating SOAP note:`, error);
      res.status(500).json({
        success: false,
        message: 'Error updating SOAP note',
        error: 'SERVER_ERROR'
      });
    }
  }

  // Eliminar una nota SOAP
  async deleteSoapNote(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      
      // Obtener la nota existente
      const existingNote = await SoapNoteRepository.getDetailedById(Number(id));
      if (!existingNote) {
        res.status(404).json({
          success: false,
          message: `SOAP note with id ${id} not found`,
          error: 'NOTE_NOT_FOUND'
        });
        return;
      }
      
      // Verificar que el médico que elimina la nota sea el propietario
      if (req.user && req.user.id !== existingNote.patientMedic.medic.id) {
        res.status(403).json({
          success: false,
          message: 'You do not have permission to delete this note',
          error: 'FORBIDDEN'
        });
        return;
      }
      
      // No permitir eliminar una nota firmada
      if (existingNote.signed) {
        res.status(400).json({
          success: false,
          message: 'Cannot delete a signed note',
          error: 'NOTE_SIGNED'
        });
        return;
      }
      
      const success = await SoapNoteRepository.delete(Number(id));
      
      if (!success) {
        res.status(404).json({
          success: false,
          message: `SOAP note with id ${id} not found`,
          error: 'NOTE_NOT_FOUND'
        });
        return;
      }
      
      res.status(200).json({
        success: true,
        message: 'SOAP note deleted successfully'
      });
    } catch (error) {
      console.error(`Error deleting SOAP note:`, error);
      res.status(500).json({
        success: false,
        message: 'Error deleting SOAP note',
        error: 'SERVER_ERROR'
      });
    }
  }

  // Firmar una nota SOAP
  async signSoapNote(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      
      // Obtener la nota existente
      const existingNote = await SoapNoteRepository.getDetailedById(Number(id));
      if (!existingNote) {
        res.status(404).json({
          success: false,
          message: `SOAP note with id ${id} not found`,
          error: 'NOTE_NOT_FOUND'
        });
        return;
      }
      
      // Verificar que el médico que firma la nota sea el propietario
      if (req.user && req.user.id !== existingNote.patientMedic.medic.id) {
        res.status(403).json({
          success: false,
          message: 'You do not have permission to sign this note',
          error: 'FORBIDDEN'
        });
        return;
      }
      
      // No permitir firmar una nota ya firmada
      if (existingNote.signed) {
        res.status(400).json({
          success: false,
          message: 'Note is already signed',
          error: 'NOTE_ALREADY_SIGNED'
        });
        return;
      }
      
      const soapNote = await SoapNoteRepository.update(Number(id), { signed: true });
      
      res.status(200).json({
        success: true,
        data: soapNote,
        message: 'SOAP note signed successfully'
      });
    } catch (error) {
      console.error(`Error signing SOAP note:`, error);
      res.status(500).json({
        success: false,
        message: 'Error signing SOAP note',
        error: 'SERVER_ERROR'
      });
    }
  }

  // Obtener todas las notas SOAP de un paciente para el médico autenticado
  async getSoapNotesByPatient(req: Request, res: Response): Promise<void> {
    try {
      const { patientId } = req.params;
      const medicId = req.user!.id;
      
      // Verificar que el paciente exista
      const patient = await PatientRepository.getById(Number(patientId));
      if (!patient) {
        res.status(404).json({
          success: false,
          message: 'Patient not found',
          error: 'PATIENT_NOT_FOUND'
        });
        return;
      }
      
      // Buscar la relación médico-paciente
      const patientMedic = await PatientMedicRepository.getByMedicAndPatient(
        medicId,
        Number(patientId)
      );
      
      if (!patientMedic) {
        res.status(404).json({
          success: false,
          message: 'You do not have a relationship with this patient',
          error: 'RELATION_NOT_FOUND'
        });
        return;
      }
      
      // Obtener las notas SOAP
      const soapNotes = await SoapNoteRepository.getByPatientMedicId(patientMedic.id);
      
      res.status(200).json({
        success: true,
        data: soapNotes
      });
    } catch (error) {
      console.error(`Error getting SOAP notes:`, error);
      res.status(500).json({
        success: false,
        message: 'Error retrieving SOAP notes',
        error: 'SERVER_ERROR'
      });
    }
  }

  // Mantener este método para compatibilidad con rutas existentes
  async getSoapNotesByPatientMedic(req: Request, res: Response): Promise<void> {
    try {
      const { patientMedicId } = req.params;
      
      // Verificar que exista la relación médico-paciente
      const patientMedic = await PatientMedicRepository.getDetailedById(Number(patientMedicId));
      if (!patientMedic) {
        res.status(404).json({
          success: false,
          message: 'Patient-Medic relationship not found',
          error: 'RELATION_NOT_FOUND'
        });
        return;
      }
      
      // Verificar que el médico que solicita las notas sea el propietario
      if (req.user && req.user.id !== patientMedic.medic_id) {
        res.status(403).json({
          success: false,
          message: 'You do not have permission to access these notes',
          error: 'FORBIDDEN'
        });
        return;
      }
      
      const soapNotes = await SoapNoteRepository.getByPatientMedicId(Number(patientMedicId));
      
      res.status(200).json({
        success: true,
        data: soapNotes
      });
    } catch (error) {
      console.error(`Error getting SOAP notes:`, error);
      res.status(500).json({
        success: false,
        message: 'Error retrieving SOAP notes',
        error: 'SERVER_ERROR'
      });
    }
  }
}

export default new SoapNoteController(); 