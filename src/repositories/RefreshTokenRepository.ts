import { RefreshToken } from '../models';
import { RefreshTokenInput, RefreshTokenOutput } from '../models/RefreshToken';
import { v4 as uuidv4 } from 'uuid';

class RefreshTokenRepository {
  async createToken(medicId: number, ipAddress: string, expiresInDays: number = 7): Promise<RefreshTokenOutput> {
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + expiresInDays);

    const token = uuidv4(); // Generar token único

    const refreshToken = await RefreshToken.create({
      token,
      medic_id: medicId,
      expires_at: expiresAt,
      created_ip: ipAddress,
    });

    return refreshToken.toJSON() as RefreshTokenOutput;
  }

  async findByToken(token: string): Promise<RefreshToken | null> {
    return await RefreshToken.findOne({
      where: { token }
    });
  }

  async revokeToken(token: string): Promise<boolean> {
    const refreshToken = await this.findByToken(token);
    
    if (!refreshToken) {
      return false;
    }

    // Revocar el token
    refreshToken.revoked = true;
    await refreshToken.save();
    
    return true;
  }

  async revokeAllUserTokens(medicId: number): Promise<number> {
    const result = await RefreshToken.update(
      { revoked: true },
      { where: { medic_id: medicId, revoked: false } }
    );
    
    return result[0]; // Número de filas actualizadas
  }

  async removeExpiredTokens(): Promise<number> {
    const result = await RefreshToken.destroy({
      where: {
        expires_at: { $lt: new Date() }
      }
    });
    
    return result;
  }

  async getActiveTokensForUser(medicId: number): Promise<RefreshTokenOutput[]> {
    const tokens = await RefreshToken.findAll({
      where: {
        medic_id: medicId,
        revoked: false,
        expires_at: { $gt: new Date() }
      }
    });
    
    return tokens.map(token => token.toJSON() as RefreshTokenOutput);
  }
}

export default new RefreshTokenRepository(); 