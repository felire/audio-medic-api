import { SoapNote } from '../models';
import { SoapNoteInput, SoapNoteOutput } from '../models/SoapNote';

class SoapNoteRepository {
  async create(payload: SoapNoteInput): Promise<SoapNoteOutput> {
    const soapNote = await SoapNote.create(payload);
    return soapNote.toJSON() as SoapNoteOutput;
  }

  async update(id: number, payload: Partial<SoapNoteInput>): Promise<SoapNoteOutput | null> {
    const soapNote = await SoapNote.findByPk(id);
    
    if (!soapNote) {
      return null;
    }

    const updatedSoapNote = await soapNote.update(payload);
    return updatedSoapNote.toJSON() as SoapNoteOutput;
  }

  async getById(id: number): Promise<SoapNoteOutput | null> {
    const soapNote = await SoapNote.findByPk(id);
    return soapNote ? (soapNote.toJSON() as SoapNoteOutput) : null;
  }

  async delete(id: number): Promise<boolean> {
    const result = await SoapNote.destroy({
      where: { id }
    });
    
    return !!result;
  }

  async getAll(): Promise<SoapNoteOutput[]> {
    const soapNotes = await SoapNote.findAll();
    return soapNotes.map(note => note.toJSON() as SoapNoteOutput);
  }

  async getByPatientMedicId(patientMedicId: number): Promise<SoapNoteOutput[]> {
    const soapNotes = await SoapNote.findAll({
      where: { patient_medic_id: patientMedicId },
      include: ['noteType'],
      order: [['date_created', 'DESC']]
    });
    return soapNotes.map(note => note.toJSON() as SoapNoteOutput);
  }

  async getDetailedById(id: number): Promise<any> {
    const soapNote = await SoapNote.findByPk(id, {
      include: [
        {
          association: 'patientMedic',
          include: ['medic', 'patient']
        },
        'noteType'
      ]
    });
    return soapNote ? soapNote.toJSON() : null;
  }

  async countByPatientMedicId(patientMedicId: number): Promise<number> {
    return await SoapNote.count({
      where: { patient_medic_id: patientMedicId }
    });
  }
}

export default new SoapNoteRepository(); 