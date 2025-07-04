import { Request, Response } from 'express';
import UserRepository from '../repositories/UserRepository';

class UserController {
  async createUser(req: Request, res: Response): Promise<void> {
    try {
      const user = await UserRepository.create(req.body);
      res.status(201).json(user);
    } catch (error) {
      console.error('Error creating user:', error);
      res.status(500).json({ message: 'Error creating user', error });
    }
  }

  async updateUser(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const user = await UserRepository.update(Number(id), req.body);
      
      if (!user) {
        res.status(404).json({ message: `User with id ${id} not found` });
        return;
      }
      
      res.status(200).json(user);
    } catch (error) {
      console.error(`Error updating user:`, error);
      res.status(500).json({ message: 'Error updating user', error });
    }
  }

  async getUser(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const user = await UserRepository.getById(Number(id));
      
      if (!user) {
        res.status(404).json({ message: `User with id ${id} not found` });
        return;
      }
      
      res.status(200).json(user);
    } catch (error) {
      console.error(`Error getting user:`, error);
      res.status(500).json({ message: 'Error getting user', error });
    }
  }

  async deleteUser(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const success = await UserRepository.delete(Number(id));
      
      if (!success) {
        res.status(404).json({ message: `User with id ${id} not found` });
        return;
      }
      
      res.status(204).end();
    } catch (error) {
      console.error(`Error deleting user:`, error);
      res.status(500).json({ message: 'Error deleting user', error });
    }
  }

  async getAllUsers(_req: Request, res: Response): Promise<void> {
    try {
      const users = await UserRepository.getAll();
      res.status(200).json(users);
    } catch (error) {
      console.error('Error getting all users:', error);
      res.status(500).json({ message: 'Error getting all users', error });
    }
  }
}

export default new UserController(); 