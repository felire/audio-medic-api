import { NoteType } from '../models';
import { NoteTypeInput, NoteTypeOutput } from '../models/NoteType';

class NoteTypeRepository {
  async create(payload: NoteTypeInput): Promise<NoteTypeOutput> {
    const noteType = await NoteType.create(payload);
    return noteType.toJSON() as NoteTypeOutput;
  }

  async update(id: number, payload: Partial<NoteTypeInput>): Promise<NoteTypeOutput | null> {
    const noteType = await NoteType.findByPk(id);
    
    if (!noteType) {
      return null;
    }

    const updatedNoteType = await noteType.update(payload);
    return updatedNoteType.toJSON() as NoteTypeOutput;
  }

  async getById(id: number): Promise<NoteTypeOutput | null> {
    const noteType = await NoteType.findByPk(id);
    return noteType ? (noteType.toJSON() as NoteTypeOutput) : null;
  }

  async delete(id: number): Promise<boolean> {
    const result = await NoteType.destroy({
      where: { id }
    });
    
    return !!result;
  }

  async getAll(): Promise<NoteTypeOutput[]> {
    const noteTypes = await NoteType.findAll();
    return noteTypes.map(noteType => noteType.toJSON() as NoteTypeOutput);
  }

  async findByName(name: string): Promise<NoteTypeOutput | null> {
    const noteType = await NoteType.findOne({
      where: { name }
    });
    return noteType ? (noteType.toJSON() as NoteTypeOutput) : null;
  }
}

export default new NoteTypeRepository(); 