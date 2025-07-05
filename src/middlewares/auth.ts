import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { verifyAccessToken, ACCESS_TOKEN_SECRET } from '../config/auth';

// Tipos de errores de autenticación
export enum AuthErrorType {
  NO_TOKEN = 'NO_TOKEN',
  EXPIRED_TOKEN = 'EXPIRED_TOKEN',
  INVALID_TOKEN = 'INVALID_TOKEN',
  AUTH_FAILED = 'AUTH_FAILED',
  FORBIDDEN = 'FORBIDDEN'
}

// Extender el tipo Request para incluir el usuario autenticado
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: number;
        email: string;
        [key: string]: any;
      };
    }
  }
}

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  try {
    // Obtener el token del header Authorization
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ 
        success: false,
        message: 'No token provided',
        error: AuthErrorType.NO_TOKEN
      });
    }

    // Extraer el token
    const token = authHeader.split(' ')[1];
    
    try {
      // Verificar el token directamente para capturar el error de expiración
      const decoded = jwt.verify(token, ACCESS_TOKEN_SECRET);
      
      // Agregar el usuario al request
      req.user = decoded as any;
      next();
    } catch (error: any) {
      // Verificar si el error es por token expirado
      if (error.name === 'TokenExpiredError') {
        return res.status(401).json({ 
          success: false,
          message: 'Token expired',
          error: AuthErrorType.EXPIRED_TOKEN
        });
      } else {
        return res.status(401).json({ 
          success: false,
          message: 'Invalid token',
          error: AuthErrorType.INVALID_TOKEN
        });
      }
    }
  } catch (error) {
    console.error('Authentication error:', error);
    return res.status(401).json({ 
      success: false,
      message: 'Authentication failed',
      error: AuthErrorType.AUTH_FAILED
    });
  }
};

// Middleware para asegurar que un médico solo pueda modificar sus propios datos
export const checkSelfOrAdmin = (req: Request, res: Response, next: NextFunction) => {
  try {
    // El usuario debe estar autenticado (este middleware debe usarse después de authenticate)
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required',
        error: AuthErrorType.NO_TOKEN
      });
    }

    // Obtener el ID del médico de los parámetros de la ruta
    const medicId = Number(req.params.id);
    
    // Si el ID del usuario autenticado coincide con el ID del médico en la ruta, permitir
    if (req.user.id === medicId) {
      return next();
    }
    
    // Si llegamos aquí, el usuario no está autorizado
    return res.status(403).json({
      success: false,
      message: 'You can only modify your own data',
      error: AuthErrorType.FORBIDDEN
    });
  } catch (error) {
    console.error('Authorization error:', error);
    return res.status(500).json({
      success: false,
      message: 'Error checking permissions',
      error: 'SERVER_ERROR'
    });
  }
};

export default {
  authenticate,
  checkSelfOrAdmin,
  AuthErrorType
}; 