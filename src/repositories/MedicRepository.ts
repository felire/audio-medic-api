import { Medic, PatientMedic } from '../models';
import { MedicInput, MedicOutput } from '../models/Medic';

class MedicRepository {
  async create(payload: MedicInput): Promise<MedicOutput> {
    const medic = await Medic.create(payload);
    return medic.toJSON() as MedicOutput;
  }

  async update(id: number, payload: Partial<MedicInput>): Promise<MedicOutput | null> {
    const medic = await Medic.findByPk(id);
    
    if (!medic) {
      return null;
    }

    const updatedMedic = await medic.update(payload);
    return updatedMedic.toJSON() as MedicOutput;
  }

  async getById(id: number): Promise<MedicOutput | null> {
    const medic = await Medic.findByPk(id);
    return medic ? (medic.toJSON() as MedicOutput) : null;
  }

  async delete(id: number): Promise<boolean> {
    const result = await Medic.destroy({
      where: { id }
    });
    
    return !!result;
  }

  async getAll(): Promise<MedicOutput[]> {
    const medics = await Medic.findAll();
    return medics.map(medic => medic.toJSON() as MedicOutput);
  }

  async findByEmail(email: string): Promise<MedicOutput | null> {
    const medic = await Medic.findOne({
      where: { email }
    });
    return medic ? (medic.toJSON() as MedicOutput) : null;
  }

  async getMedicWithPatients(id: number): Promise<any> {
    const medic = await Medic.findByPk(id, {
      include: [
        {
          model: PatientMedic,
          as: 'patientMedics',
          include: ['patient']
        }
      ]
    });
    return medic ? medic.toJSON() : null;
  }
}

export default new MedicRepository(); 