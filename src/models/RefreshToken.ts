import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

interface RefreshTokenAttributes {
  id: number;
  token: string;
  medic_id: number;
  expires_at: Date;
  revoked: boolean;
  created_ip: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface RefreshTokenInput extends Optional<RefreshTokenAttributes, 'id' | 'revoked'> {}
export interface RefreshTokenOutput extends Required<RefreshTokenAttributes> {}

class RefreshToken extends Model<RefreshTokenAttributes, RefreshTokenInput> implements RefreshTokenAttributes {
  public id!: number;
  public token!: string;
  public medic_id!: number;
  public expires_at!: Date;
  public revoked!: boolean;
  public created_ip!: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // Método para comprobar si el token ha expirado
  public isExpired(): boolean {
    return new Date() >= this.expires_at;
  }

  // Método para comprobar si el token es activo
  public isActive(): boolean {
    return !this.revoked && !this.isExpired();
  }
}

RefreshToken.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    token: {
      type: DataTypes.STRING(500),
      allowNull: false,
      unique: true,
    },
    medic_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'medics',
        key: 'id',
      },
    },
    expires_at: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    revoked: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    created_ip: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'refresh_tokens',
    timestamps: true,
  }
);

export default RefreshToken; 