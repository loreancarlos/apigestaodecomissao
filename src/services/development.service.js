import db from '../database/connection.js';

export class DevelopmentService {
  async list() {
    return db('developments')
      .select('*')
      .orderBy('name');
  }

  async create(data) {
    const [development] = await db('developments')
      .insert(data)
      .returning('*');

    return development;
  }

  async findById(id) {
    return db('developments')
      .where({ id })
      .first();
  }

  async update(id, data) {
    const [development] = await db('developments')
      .where({ id })
      .update({
        ...data,
        updatedAt: db.fn.now()
      })
      .returning('*');

    return development;
  }

  async delete(id) {
    const hasSales = await db('sales')
      .where({ developmentId: id })
      .first();

    if (hasSales) {
      throw new Error('DEVELOPMENT_HAS_SALES');
    }

    await db('developments')
      .where({ id })
      .delete();
  }
}
