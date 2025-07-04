import { Patient, PatientMedic } from '../models';
import { PatientInput, PatientOutput } from '../models/Patient';

class PatientRepository {
  async create(payload: PatientInput): Promise<PatientOutput> {
    const patient = await Patient.create(payload);
    return patient.toJSON() as PatientOutput;
  }

  async update(id: number, payload: Partial<PatientInput>): Promise<PatientOutput | null> {
    const patient = await Patient.findByPk(id);
    
    if (!patient) {
      return null;
    }

    const updatedPatient = await patient.update(payload);
    return updatedPatient.toJSON() as PatientOutput;
  }

  async getById(id: number): Promise<PatientOutput | null> {
    const patient = await Patient.findByPk(id);
    return patient ? (patient.toJSON() as PatientOutput) : null;
  }

  async delete(id: number): Promise<boolean> {
    const result = await Patient.destroy({
      where: { id }
    });
    
    return !!result;
  }

  async getAll(): Promise<PatientOutput[]> {
    const patients = await Patient.findAll();
    return patients.map(patient => patient.toJSON() as PatientOutput);
  }

  async getPatientWithMedics(id: number): Promise<any> {
    const patient = await Patient.findByPk(id, {
      include: [
        {
          model: PatientMedic,
          as: 'patientMedics',
          include: ['medic']
        }
      ]
    });
    return patient ? patient.toJSON() : null;
  }

  async findByDocument(document: string): Promise<PatientOutput | null> {
    const patient = await Patient.findOne({
      where: { document }
    });
    return patient ? (patient.toJSON() as PatientOutput) : null;
  }
}

export default new PatientRepository(); 