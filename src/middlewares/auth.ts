import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { verifyAccessToken, ACCESS_TOKEN_SECRET } from '../config/auth';

// Tipos de errores de autenticación
export enum AuthErrorType {
  NO_TOKEN = 'NO_TOKEN',
  EXPIRED_TOKEN = 'EXPIRED_TOKEN',
  INVALID_TOKEN = 'INVALID_TOKEN',
  AUTH_FAILED = 'AUTH_FAILED'
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
        message: 'No token provided',
        errorType: AuthErrorType.NO_TOKEN
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
          message: 'Token expired',
          errorType: AuthErrorType.EXPIRED_TOKEN
        });
      } else {
        return res.status(401).json({ 
          message: 'Invalid token',
          errorType: AuthErrorType.INVALID_TOKEN
        });
      }
    }
  } catch (error) {
    console.error('Authentication error:', error);
    return res.status(401).json({ 
      message: 'Authentication failed',
      errorType: AuthErrorType.AUTH_FAILED
    });
  }
};

export default {
  authenticate,
  AuthErrorType
}; 