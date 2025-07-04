import { body } from 'express-validator';

export const registerValidator = [
  body('name')
    .not().isEmpty().withMessage('El nombre es obligatorio')
    .isLength({ min: 2, max: 100 }).withMessage('El nombre debe tener entre 2 y 100 caracteres'),
  
  body('email')
    .not().isEmpty().withMessage('El email es obligatorio')
    .isEmail().withMessage('Debe proporcionar un email válido'),
  
  body('password_hash')
    .not().isEmpty().withMessage('La contraseña es obligatoria')
    .isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres'),
  
  body('specialty')
    .not().isEmpty().withMessage('La especialidad es obligatoria')
    .isLength({ min: 2, max: 100 }).withMessage('La especialidad debe tener entre 2 y 100 caracteres')
];

export const loginValidator = [
  body('email')
    .not().isEmpty().withMessage('El email es obligatorio')
    .isEmail().withMessage('Debe proporcionar un email válido'),
  
  body('password')
    .not().isEmpty().withMessage('La contraseña es obligatoria')
];

export const changePasswordValidator = [
  body('currentPassword')
    .not().isEmpty().withMessage('La contraseña actual es obligatoria'),
  
  body('newPassword')
    .not().isEmpty().withMessage('La nueva contraseña es obligatoria')
    .isLength({ min: 6 }).withMessage('La nueva contraseña debe tener al menos 6 caracteres')
];

export default {
  registerValidator,
  loginValidator,
  changePasswordValidator
}; 