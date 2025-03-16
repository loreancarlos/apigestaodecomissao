import db from '../database/connection.js';

export class ClientService {
  async list() {
    return db('clients')
      .select('*')
      .orderBy('name');
  }

  async create(data) {
    const [client] = await db('clients')
      .insert(data)
      .returning('*');
    return client;
  }

  async findById(id) {
    return db('clients')
      .where({ id })
      .first();
  }

  async update(id, data) {
    const [client] = await db('clients')
      .where({ id })
      .update({
        ...data,
        updatedAt: db.fn.now()
      })
      .returning('*');
    return client;
  }

  async delete(id) {
    const hasSales = await db('sales')
      .where({ clientId: id })
      .first();
    if (hasSales) {
      throw new Error('CLIENT_HAS_SALES');
    }
    await db('clients').where({ id }).delete();
  }
}
