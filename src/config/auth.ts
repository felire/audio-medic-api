import jwt from 'jsonwebtoken';
import config from './env';

// Secret key for JWT
export const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET || 'audio-medic-access-token-secret-change-in-production';
export const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || 'audio-medic-refresh-token-secret-change-in-production';

// Token expiration times
export const ACCESS_TOKEN_EXPIRES_IN = '15m'; // Access token dura 15 minutos
export const REFRESH_TOKEN_EXPIRES_IN = '7d'; // Refresh token dura 7 días
export const REFRESH_TOKEN_COOKIE_NAME = 'refreshToken';

// Generate access token
export const generateAccessToken = (payload: object): string => {
  return jwt.sign(payload, ACCESS_TOKEN_SECRET, {
    expiresIn: ACCESS_TOKEN_EXPIRES_IN
  });
};

// Generate refresh token JWT (distinto del token UUID guardado en DB)
export const generateRefreshToken = (payload: object): string => {
  return jwt.sign(payload, REFRESH_TOKEN_SECRET, {
    expiresIn: REFRESH_TOKEN_EXPIRES_IN
  });
};

// Verify access token
export const verifyAccessToken = (token: string): any => {
  try {
    return jwt.verify(token, ACCESS_TOKEN_SECRET);
  } catch (error) {
    return null;
  }
};

// Verify refresh token
export const verifyRefreshToken = (token: string): any => {
  try {
    return jwt.verify(token, REFRESH_TOKEN_SECRET);
  } catch (error) {
    return null;
  }
};

// Get refresh token cookie options
export const getRefreshTokenCookieOptions = () => {
  return {
    httpOnly: true,
    secure: config.NODE_ENV === 'production',
    sameSite: 'strict' as const,
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 días en milisegundos
    path: '/'
  };
};

export default {
  ACCESS_TOKEN_SECRET,
  REFRESH_TOKEN_SECRET,
  ACCESS_TOKEN_EXPIRES_IN,
  REFRESH_TOKEN_EXPIRES_IN,
  REFRESH_TOKEN_COOKIE_NAME,
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
  getRefreshTokenCookieOptions
}; 