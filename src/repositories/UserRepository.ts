import User, { UserInput, UserOutput } from '../models/User';

class UserRepository {
  async create(payload: UserInput): Promise<UserOutput> {
    const user = await User.create(payload);
    return user.toJSON() as UserOutput;
  }

  async update(id: number, payload: Partial<UserInput>): Promise<UserOutput | null> {
    const user = await User.findByPk(id);
    
    if (!user) {
      return null;
    }

    const updatedUser = await user.update(payload);
    return updatedUser.toJSON() as UserOutput;
  }

  async getById(id: number): Promise<UserOutput | null> {
    const user = await User.findByPk(id);
    return user ? (user.toJSON() as UserOutput) : null;
  }

  async delete(id: number): Promise<boolean> {
    const result = await User.destroy({
      where: { id }
    });
    
    return !!result;
  }

  async getAll(): Promise<UserOutput[]> {
    const users = await User.findAll();
    return users.map(user => user.toJSON() as UserOutput);
  }
}

export default new UserRepository(); 