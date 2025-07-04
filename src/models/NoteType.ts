import { DataTypes, Model, Optional, Association } from 'sequelize';
import sequelize from '../config/database';
import SoapNote from './SoapNote';

interface NoteTypeAttributes {
  id: number;
  name: string;
  description: string;
  prompt: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface NoteTypeInput extends Optional<NoteTypeAttributes, 'id'> {}
export interface NoteTypeOutput extends Required<NoteTypeAttributes> {}

class NoteType extends Model<NoteTypeAttributes, NoteTypeInput> implements NoteTypeAttributes {
  public id!: number;
  public name!: string;
  public description!: string;
  public prompt!: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // Associations
  public readonly soapNotes?: SoapNote[];
  
  public static associations: {
    soapNotes: Association<NoteType, SoapNote>;
  };
}

NoteType.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    prompt: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'note_types',
    timestamps: true,
  }
);

export default NoteType; 