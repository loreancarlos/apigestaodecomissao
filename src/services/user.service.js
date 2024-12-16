import bcrypt from 'bcryptjs';
import db from '../database/connection.js';

export class UserService {
  async list() {
    return db('users')
      .select('id', 'name', 'email', 'role', 'active', 'createdAt', 'lastLogin');
  }

  async create(data) {
    const hashedPassword = await bcrypt.hash(data.password, 10);
    
    const [user] = await db('users')
      .insert({
        ...data,
        password: hashedPassword
      })
      .returning(['id', 'name', 'email', 'role', 'active', 'createdAt']);
    
    return user;
  }

  async findById(id) {
    return db('users')
      .where({ id })
      .select('id', 'name', 'email', 'role', 'active', 'createdAt', 'lastLogin')
      .first();
  }

  async update(id, data) {
    const updateData = { ...data };
    
    if (data.password) {
      updateData.password = await bcrypt.hash(data.password, 10);
    }

    const [user] = await db('users')
      .where({ id })
      .update(updateData)
      .returning(['id', 'name', 'email', 'role', 'active', 'createdAt', 'lastLogin']);
    
    return user;
  }

  async delete(id) {
    await db('users').where({ id }).delete();
  }

  async toggleStatus(id) {
    const [user] = await db('users')
      .where({ id })
      .update({
        active: db.raw('NOT active')
      })
      .returning(['id', 'name', 'email', 'role', 'active', 'createdAt', 'lastLogin']);
    
    return user;
  }
}
