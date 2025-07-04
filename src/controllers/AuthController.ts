import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import bcrypt from 'bcrypt';
import { 
  generateAccessToken, 
  generateRefreshToken,
  verifyRefreshToken,
  REFRESH_TOKEN_COOKIE_NAME,
  getRefreshTokenCookieOptions 
} from '../config/auth';
import MedicRepository from '../repositories/MedicRepository';
import RefreshTokenRepository from '../repositories/RefreshTokenRepository';

class AuthController {
  async register(req: Request, res: Response): Promise<void> {
    try {
      // Validar los datos de entrada
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
      }

      const { email } = req.body;

      // Verificar si el médico ya existe
      const existingMedic = await MedicRepository.findByEmail(email);
      if (existingMedic) {
        res.status(409).json({ message: 'El email ya está registrado' });
        return;
      }

      // Crear el médico
      const medic = await MedicRepository.create(req.body);
      
      // Generar tokens
      await this.setTokensAndResponse(res, medic, req.ip);
    } catch (error) {
      console.error('Error en el registro:', error);
      res.status(500).json({ message: 'Error en el servidor' });
    }
  }

  async login(req: Request, res: Response): Promise<void> {
    try {
      // Validar los datos de entrada
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
      }

      const { email, password } = req.body;

      // Buscar el médico por email
      const medic = await MedicRepository.findByEmail(email);
      if (!medic) {
        res.status(401).json({ message: 'Credenciales inválidas' });
        return;
      }

      // Verificar contraseña
      const isPasswordValid = await bcrypt.compare(password, medic.password_hash);
      if (!isPasswordValid) {
        res.status(401).json({ message: 'Credenciales inválidas' });
        return;
      }

      // Generar tokens
      await this.setTokensAndResponse(res, medic, req.ip);
    } catch (error) {
      console.error('Error en el login:', error);
      res.status(500).json({ message: 'Error en el servidor' });
    }
  }

  async refreshToken(req: Request, res: Response): Promise<void> {
    try {
      // Obtener el token de la cookie o del body
      const refreshToken = req.cookies[REFRESH_TOKEN_COOKIE_NAME] || req.body.refreshToken;

      if (!refreshToken) {
        res.status(401).json({ message: 'Refresh token no proporcionado' });
        return;
      }

      // Verificar el token en la base de datos
      const storedRefreshToken = await RefreshTokenRepository.findByToken(refreshToken);

      if (!storedRefreshToken) {
        res.status(401).json({ message: 'Refresh token inválido' });
        return;
      }

      // Comprobar si el token está activo (no revocado y no expirado)
      if (!storedRefreshToken.isActive()) {
        res.status(401).json({ message: 'Refresh token expirado o revocado' });
        return;
      }

      // Verificar el token JWT
      const decoded = verifyRefreshToken(refreshToken);
      if (!decoded) {
        // Revocar el token en la base de datos
        await RefreshTokenRepository.revokeToken(refreshToken);
        res.status(401).json({ message: 'Refresh token JWT inválido' });
        return;
      }

      // Obtener el médico
      const medic = await MedicRepository.getById(storedRefreshToken.medic_id);
      if (!medic) {
        res.status(404).json({ message: 'Médico no encontrado' });
        return;
      }

      // Revocar el token actual
      await RefreshTokenRepository.revokeToken(refreshToken);

      // Generar nuevos tokens
      await this.setTokensAndResponse(res, medic, req.ip);
    } catch (error) {
      console.error('Error al renovar token:', error);
      res.status(500).json({ message: 'Error en el servidor' });
    }
  }

  async logout(req: Request, res: Response): Promise<void> {
    try {
      const refreshToken = req.cookies[REFRESH_TOKEN_COOKIE_NAME] || req.body.refreshToken;

      // Revocar el token en la base de datos si existe
      if (refreshToken) {
        await RefreshTokenRepository.revokeToken(refreshToken);
      }

      // Limpiar la cookie
      res.clearCookie(REFRESH_TOKEN_COOKIE_NAME);

      res.status(200).json({ message: 'Sesión cerrada correctamente' });
    } catch (error) {
      console.error('Error en el logout:', error);
      res.status(500).json({ message: 'Error en el servidor' });
    }
  }

  async getProfile(req: Request, res: Response): Promise<void> {
    try {
      // El usuario ya está en req.user gracias al middleware de autenticación
      const medic = await MedicRepository.getById(req.user!.id);
      
      if (!medic) {
        res.status(404).json({ message: 'Médico no encontrado' });
        return;
      }

      // Omitir password_hash en la respuesta
      const { password_hash, ...medicWithoutPassword } = medic;

      res.status(200).json(medicWithoutPassword);
    } catch (error) {
      console.error('Error al obtener el perfil:', error);
      res.status(500).json({ message: 'Error en el servidor' });
    }
  }

  async changePassword(req: Request, res: Response): Promise<void> {
    try {
      const { currentPassword, newPassword } = req.body;
      
      // Buscar el médico
      const medic = await MedicRepository.getById(req.user!.id);
      if (!medic) {
        res.status(404).json({ message: 'Médico no encontrado' });
        return;
      }

      // Verificar contraseña actual
      const isPasswordValid = await bcrypt.compare(currentPassword, medic.password_hash);
      if (!isPasswordValid) {
        res.status(401).json({ message: 'Contraseña actual incorrecta' });
        return;
      }

      // Actualizar contraseña
      await MedicRepository.update(req.user!.id, {
        password_hash: newPassword
      });

      // Revocar todos los tokens de refresco existentes
      await RefreshTokenRepository.revokeAllUserTokens(medic.id);

      // Generar nuevos tokens
      await this.setTokensAndResponse(res, medic, req.ip);
    } catch (error) {
      console.error('Error al cambiar la contraseña:', error);
      res.status(500).json({ message: 'Error en el servidor' });
    }
  }

  // Método auxiliar para generar tokens y establecer la respuesta
  private async setTokensAndResponse(res: Response, medic: any, ipAddress: string): Promise<void> {
    // Preparar los datos del usuario para el token
    const userPayload = {
      id: medic.id,
      email: medic.email,
      name: medic.name
    };

    // Generar access token (JWT)
    const accessToken = generateAccessToken(userPayload);

    // Crear refresh token en la base de datos
    const dbRefreshToken = await RefreshTokenRepository.createToken(medic.id, ipAddress);

    // Establecer el refresh token como cookie
    res.cookie(
      REFRESH_TOKEN_COOKIE_NAME,
      dbRefreshToken.token,
      getRefreshTokenCookieOptions()
    );

    // Omitir password_hash en la respuesta
    const { password_hash, ...medicWithoutPassword } = medic;

    // Enviar respuesta
    res.status(200).json({
      medic: medicWithoutPassword,
      accessToken,
      refreshToken: dbRefreshToken.token
    });
  }
}

export default new AuthController(); 