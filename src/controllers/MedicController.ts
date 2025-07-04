import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import MedicRepository from '../repositories/MedicRepository';

class MedicController {
  async getAllMedics(_req: Request, res: Response): Promise<void> {
    try {
      const medics = await MedicRepository.getAll();
      
      // Omitir contraseñas en la respuesta
      const medicsWithoutPasswords = medics.map(({ password_hash, ...rest }) => rest);
      
      res.status(200).json(medicsWithoutPasswords);
    } catch (error) {
      console.error('Error getting medics:', error);
      res.status(500).json({ message: 'Error retrieving medics', error });
    }
  }

  async getMedicById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const medic = await MedicRepository.getById(Number(id));
      
      if (!medic) {
        res.status(404).json({ message: `Medic with id ${id} not found` });
        return;
      }
      
      // Omitir contraseña en la respuesta
      const { password_hash, ...medicWithoutPassword } = medic;
      
      res.status(200).json(medicWithoutPassword);
    } catch (error) {
      console.error(`Error getting medic:`, error);
      res.status(500).json({ message: 'Error retrieving medic', error });
    }
  }

  async createMedic(req: Request, res: Response): Promise<void> {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
      }

      const { email } = req.body;
      
      // Verificar si el email ya está registrado
      const existingMedic = await MedicRepository.findByEmail(email);
      if (existingMedic) {
        res.status(409).json({ message: 'Email already registered' });
        return;
      }
      
      const medic = await MedicRepository.create(req.body);
      
      // Omitir contraseña en la respuesta
      const { password_hash, ...medicWithoutPassword } = medic;
      
      res.status(201).json(medicWithoutPassword);
    } catch (error) {
      console.error('Error creating medic:', error);
      res.status(500).json({ message: 'Error creating medic', error });
    }
  }

  async updateMedic(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const errors = validationResult(req);
      
      if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
      }
      
      // Si se intenta actualizar el email, verificar que no exista
      if (req.body.email) {
        const existingMedic = await MedicRepository.findByEmail(req.body.email);
        if (existingMedic && existingMedic.id !== Number(id)) {
          res.status(409).json({ message: 'Email already registered by another medic' });
          return;
        }
      }
      
      const medic = await MedicRepository.update(Number(id), req.body);
      
      if (!medic) {
        res.status(404).json({ message: `Medic with id ${id} not found` });
        return;
      }
      
      // Omitir contraseña en la respuesta
      const { password_hash, ...medicWithoutPassword } = medic;
      
      res.status(200).json(medicWithoutPassword);
    } catch (error) {
      console.error(`Error updating medic:`, error);
      res.status(500).json({ message: 'Error updating medic', error });
    }
  }

  async deleteMedic(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const success = await MedicRepository.delete(Number(id));
      
      if (!success) {
        res.status(404).json({ message: `Medic with id ${id} not found` });
        return;
      }
      
      res.status(204).end();
    } catch (error) {
      console.error(`Error deleting medic:`, error);
      res.status(500).json({ message: 'Error deleting medic', error });
    }
  }

  async getMedicPatients(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const medicWithPatients = await MedicRepository.getMedicWithPatients(Number(id));
      
      if (!medicWithPatients) {
        res.status(404).json({ message: `Medic with id ${id} not found` });
        return;
      }
      
      // Omitir contraseña en la respuesta
      const { password_hash, ...medicData } = medicWithPatients;
      
      res.status(200).json(medicData);
    } catch (error) {
      console.error(`Error getting medic patients:`, error);
      res.status(500).json({ message: 'Error retrieving medic patients', error });
    }
  }
}

export default new MedicController(); 