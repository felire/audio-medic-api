import Medic from './Medic';
import Patient from './Patient';
import PatientMedic from './PatientMedic';
import NoteType from './NoteType';
import SoapNote from './SoapNote';
import RefreshToken from './RefreshToken';

// Define associations
Medic.hasMany(PatientMedic, {
  foreignKey: 'medic_id',
  as: 'patientMedics',
});

Patient.hasMany(PatientMedic, {
  foreignKey: 'patient_id',
  as: 'patientMedics',
});

PatientMedic.belongsTo(Medic, {
  foreignKey: 'medic_id',
  as: 'medic',
});

PatientMedic.belongsTo(Patient, {
  foreignKey: 'patient_id',
  as: 'patient',
});

PatientMedic.hasMany(SoapNote, {
  foreignKey: 'patient_medic_id',
  as: 'soapNotes',
});

NoteType.hasMany(SoapNote, {
  foreignKey: 'id_note_type',
  as: 'soapNotes',
});

SoapNote.belongsTo(PatientMedic, {
  foreignKey: 'patient_medic_id',
  as: 'patientMedic',
});

SoapNote.belongsTo(NoteType, {
  foreignKey: 'id_note_type',
  as: 'noteType',
});

// Asociación Médico - Refresh Token
Medic.hasMany(RefreshToken, {
  foreignKey: 'medic_id',
  as: 'refreshTokens',
});

RefreshToken.belongsTo(Medic, {
  foreignKey: 'medic_id',
  as: 'medic',
});

export {
  Medic,
  Patient,
  PatientMedic,
  NoteType,
  SoapNote,
  RefreshToken,
}; 