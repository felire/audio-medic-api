import { PatientMedic, SoapNote } from '../models';
import { PatientMedicInput, PatientMedicOutput } from '../models/PatientMedic';

class PatientMedicRepository {
  async create(payload: PatientMedicInput): Promise<PatientMedicOutput> {
    const patientMedic = await PatientMedic.create(payload);
    return patientMedic.toJSON() as PatientMedicOutput;
  }

  async update(id: number, payload: Partial<PatientMedicInput>): Promise<PatientMedicOutput | null> {
    const patientMedic = await PatientMedic.findByPk(id);
    
    if (!patientMedic) {
      return null;
    }

    const updatedPatientMedic = await patientMedic.update(payload);
    return updatedPatientMedic.toJSON() as PatientMedicOutput;
  }

  async getById(id: number): Promise<PatientMedicOutput | null> {
    const patientMedic = await PatientMedic.findByPk(id);
    return patientMedic ? (patientMedic.toJSON() as PatientMedicOutput) : null;
  }

  async delete(id: number): Promise<boolean> {
    const result = await PatientMedic.destroy({
      where: { id }
    });
    
    return !!result;
  }

  async getAll(): Promise<PatientMedicOutput[]> {
    const patientMedics = await PatientMedic.findAll();
    return patientMedics.map(pm => pm.toJSON() as PatientMedicOutput);
  }

  async getByMedicAndPatient(medicId: number, patientId: number): Promise<PatientMedicOutput | null> {
    const patientMedic = await PatientMedic.findOne({
      where: {
        medic_id: medicId,
        patient_id: patientId
      }
    });
    return patientMedic ? (patientMedic.toJSON() as PatientMedicOutput) : null;
  }

  async getDetailedById(id: number): Promise<any> {
    const patientMedic = await PatientMedic.findByPk(id, {
      include: ['medic', 'patient', 'soapNotes']
    });
    return patientMedic ? patientMedic.toJSON() : null;
  }
  
  async getByMedicId(medicId: number): Promise<PatientMedicOutput[]> {
    const patientMedics = await PatientMedic.findAll({
      where: { medic_id: medicId },
      include: ['patient']
    });
    return patientMedics.map(pm => pm.toJSON() as PatientMedicOutput);
  }

  async getByPatientId(patientId: number): Promise<PatientMedicOutput[]> {
    const patientMedics = await PatientMedic.findAll({
      where: { patient_id: patientId },
      include: ['medic']
    });
    return patientMedics.map(pm => pm.toJSON() as PatientMedicOutput);
  }
}

export default new PatientMedicRepository(); 