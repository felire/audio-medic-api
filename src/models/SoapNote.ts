import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

interface SoapNoteAttributes {
  id: number;
  patient_medic_id: number;
  id_note_type: number;
  content: string;
  date_created: Date;
  edited: boolean;
  signed: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface SoapNoteInput extends Optional<SoapNoteAttributes, 'id' | 'edited' | 'signed'> {}
export interface SoapNoteOutput extends Required<SoapNoteAttributes> {}

class SoapNote extends Model<SoapNoteAttributes, SoapNoteInput> implements SoapNoteAttributes {
  public id!: number;
  public patient_medic_id!: number;
  public id_note_type!: number;
  public content!: string;
  public date_created!: Date;
  public edited!: boolean;
  public signed!: boolean;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

SoapNote.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    patient_medic_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'patient_medic',
        key: 'id',
      },
    },
    id_note_type: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'note_types',
        key: 'id',
      },
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    date_created: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    edited: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    signed: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  },
  {
    sequelize,
    tableName: 'soap_notes',
    timestamps: true,
  }
);

export default SoapNote; 