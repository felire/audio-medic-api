import { DataTypes, Model, Optional, Association } from 'sequelize';
import sequelize from '../config/database';
import PatientMedic from './PatientMedic';
import bcrypt from 'bcrypt';

interface MedicAttributes {
  id: number;
  name: string;
  email: string;
  password_hash: string;
  specialty: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface MedicInput extends Optional<MedicAttributes, 'id'> {}
export interface MedicOutput extends Required<MedicAttributes> {}

class Medic extends Model<MedicAttributes, MedicInput> implements MedicAttributes {
  public id!: number;
  public name!: string;
  public email!: string;
  public password_hash!: string;
  public specialty!: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // Associations
  public readonly patientMedics?: PatientMedic[];
  
  public static associations: {
    patientMedics: Association<Medic, PatientMedic>;
  };

  // Instance method for password comparison
  public async comparePassword(candidatePassword: string): Promise<boolean> {
    return bcrypt.compare(candidatePassword, this.password_hash);
  }
}

Medic.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    password_hash: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    specialty: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'medics',
    timestamps: true,
    hooks: {
      beforeCreate: async (medic: Medic) => {
        if (medic.password_hash) {
          medic.password_hash = await bcrypt.hash(medic.password_hash, 10);
        }
      },
      beforeUpdate: async (medic: Medic) => {
        if (medic.changed('password_hash')) {
          medic.password_hash = await bcrypt.hash(medic.password_hash, 10);
        }
      },
    },
  }
);

export default Medic; 