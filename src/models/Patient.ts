import { DataTypes, Model, Optional, Association } from 'sequelize';
import sequelize from '../config/database';
import PatientMedic from './PatientMedic';

interface PatientAttributes {
  id: number;
  name: string;
  document: string;
  sex: 'M' | 'F' | 'O'; // Male, Female, Other
  createdAt?: Date;
  updatedAt?: Date;
}

export interface PatientInput extends Optional<PatientAttributes, 'id'> {}
export interface PatientOutput extends Required<PatientAttributes> {}

class Patient extends Model<PatientAttributes, PatientInput> implements PatientAttributes {
  public id!: number;
  public name!: string;
  public document!: string;
  public sex!: 'M' | 'F' | 'O';

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // Associations
  public readonly patientMedics?: PatientMedic[];
  
  public static associations: {
    patientMedics: Association<Patient, PatientMedic>;
  };
}

Patient.init(
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
    document: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    sex: {
      type: DataTypes.ENUM('M', 'F', 'O'),
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'patients',
    timestamps: true,
  }
);

export default Patient; 