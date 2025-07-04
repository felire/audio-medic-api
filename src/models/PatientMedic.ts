import { DataTypes, Model, Optional, Association } from 'sequelize';
import sequelize from '../config/database';
import Medic from './Medic';
import Patient from './Patient';
import SoapNote from './SoapNote';

interface PatientMedicAttributes {
  id: number;
  medic_id: number;
  patient_id: number;
  date_first_consultant: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface PatientMedicInput extends Optional<PatientMedicAttributes, 'id'> {}
export interface PatientMedicOutput extends Required<PatientMedicAttributes> {}

class PatientMedic extends Model<PatientMedicAttributes, PatientMedicInput> implements PatientMedicAttributes {
  public id!: number;
  public medic_id!: number;
  public patient_id!: number;
  public date_first_consultant!: Date;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // Associations
  public readonly medic?: Medic;
  public readonly patient?: Patient;
  public readonly soapNotes?: SoapNote[];
  
  public static associations: {
    medic: Association<PatientMedic, Medic>;
    patient: Association<PatientMedic, Patient>;
    soapNotes: Association<PatientMedic, SoapNote>;
  };
}

PatientMedic.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    medic_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'medics',
        key: 'id',
      },
    },
    patient_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'patients',
        key: 'id',
      },
    },
    date_first_consultant: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'patient_medic',
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ['medic_id', 'patient_id'],
      },
    ],
  }
);

export default PatientMedic; 