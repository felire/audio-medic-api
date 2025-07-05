import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import PatientRepository from '../repositories/PatientRepository';
import PatientMedicRepository from '../repositories/PatientMedicRepository';

class PatientController {
  // Obtener todos los pacientes
  async getAllPatients(_req: Request, res: Response): Promise<void> {
    try {
      const patients = await PatientRepository.getAll();
      res.status(200).json({
        success: true,
        data: patients
      });
    } catch (error) {
      console.error('Error getting patients:', error);
      res.status(500).json({
        success: false,
        message: 'Error retrieving patients',
        error: 'SERVER_ERROR'
      });
    }
  }

  // Obtener un paciente por ID
  async getPatientById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const patient = await PatientRepository.getById(Number(id));
      
      if (!patient) {
        res.status(404).json({
          success: false,
          message: `Patient with id ${id} not found`,
          error: 'PATIENT_NOT_FOUND'
        });
        return;
      }
      
      res.status(200).json({
        success: true,
        data: patient
      });
    } catch (error) {
      console.error(`Error getting patient:`, error);
      res.status(500).json({
        success: false,
        message: 'Error retrieving patient',
        error: 'SERVER_ERROR'
      });
    }
  }

  // Crear un nuevo paciente
  async createPatient(req: Request, res: Response): Promise<void> {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({
          success: false,
          errors: errors.array()
        });
        return;
      }

      const { document } = req.body;
      
      // Verificar si el documento ya está registrado
      const existingPatient = await PatientRepository.findByDocument(document);
      if (existingPatient) {
        res.status(409).json({
          success: false,
          message: 'Document already registered',
          error: 'DOCUMENT_ALREADY_EXISTS'
        });
        return;
      }
      
      const patient = await PatientRepository.create(req.body);
      
      // Si se proporciona un médico, crear la relación médico-paciente
      if (req.user && req.user.id) {
        const medicId = req.user.id;
        await PatientMedicRepository.create({
          medic_id: medicId,
          patient_id: patient.id,
          date_first_consultant: new Date()
        });
      }
      
      res.status(201).json({
        success: true,
        data: patient,
        message: 'Patient created successfully'
      });
    } catch (error) {
      console.error('Error creating patient:', error);
      res.status(500).json({
        success: false,
        message: 'Error creating patient',
        error: 'SERVER_ERROR'
      });
    }
  }

  // Actualizar un paciente existente
  async updatePatient(req: Request, res: Response): Promise<void> {
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
      
      // Si se intenta actualizar el documento, verificar que no exista
      if (req.body.document) {
        const existingPatient = await PatientRepository.findByDocument(req.body.document);
        if (existingPatient && existingPatient.id !== Number(id)) {
          res.status(409).json({
            success: false,
            message: 'Document already registered by another patient',
            error: 'DOCUMENT_ALREADY_EXISTS'
          });
          return;
        }
      }
      
      const patient = await PatientRepository.update(Number(id), req.body);
      
      if (!patient) {
        res.status(404).json({
          success: false,
          message: `Patient with id ${id} not found`,
          error: 'PATIENT_NOT_FOUND'
        });
        return;
      }
      
      res.status(200).json({
        success: true,
        data: patient,
        message: 'Patient updated successfully'
      });
    } catch (error) {
      console.error(`Error updating patient:`, error);
      res.status(500).json({
        success: false,
        message: 'Error updating patient',
        error: 'SERVER_ERROR'
      });
    }
  }

  // Eliminar un paciente
  async deletePatient(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const success = await PatientRepository.delete(Number(id));
      
      if (!success) {
        res.status(404).json({
          success: false,
          message: `Patient with id ${id} not found`,
          error: 'PATIENT_NOT_FOUND'
        });
        return;
      }
      
      res.status(200).json({
        success: true,
        message: 'Patient deleted successfully'
      });
    } catch (error) {
      console.error(`Error deleting patient:`, error);
      res.status(500).json({
        success: false,
        message: 'Error deleting patient',
        error: 'SERVER_ERROR'
      });
    }
  }

  // Obtener todos los médicos de un paciente
  async getPatientMedics(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const patientWithMedics = await PatientRepository.getPatientWithMedics(Number(id));
      
      if (!patientWithMedics) {
        res.status(404).json({
          success: false,
          message: `Patient with id ${id} not found`,
          error: 'PATIENT_NOT_FOUND'
        });
        return;
      }
      
      res.status(200).json({
        success: true,
        data: patientWithMedics
      });
    } catch (error) {
      console.error(`Error getting patient medics:`, error);
      res.status(500).json({
        success: false,
        message: 'Error retrieving patient medics',
        error: 'SERVER_ERROR'
      });
    }
  }

  // Asignar un paciente a un médico (el médico autenticado)
  async assignPatientToMedic(req: Request, res: Response): Promise<void> {
    try {
      const { patientId } = req.params;
      const medicId = req.user!.id;
      
      // Verificar si el paciente existe
      const patient = await PatientRepository.getById(Number(patientId));
      if (!patient) {
        res.status(404).json({
          success: false,
          message: `Patient with id ${patientId} not found`,
          error: 'PATIENT_NOT_FOUND'
        });
        return;
      }
      
      // Verificar si ya existe la relación médico-paciente
      const existingRelation = await PatientMedicRepository.getByMedicAndPatient(
        medicId,
        Number(patientId)
      );
      
      if (existingRelation) {
        res.status(409).json({
          success: false,
          message: 'This patient is already assigned to you',
          error: 'RELATION_ALREADY_EXISTS'
        });
        return;
      }
      
      // Crear la relación
      const patientMedic = await PatientMedicRepository.create({
        medic_id: medicId,
        patient_id: Number(patientId),
        date_first_consultant: new Date()
      });
      
      res.status(201).json({
        success: true,
        data: patientMedic,
        message: 'Patient assigned to medic successfully'
      });
    } catch (error) {
      console.error('Error assigning patient to medic:', error);
      res.status(500).json({
        success: false,
        message: 'Error assigning patient to medic',
        error: 'SERVER_ERROR'
      });
    }
  }
}

export default new PatientController(); 