import db from '../database/connection.js';

export class LeadService {
  async list(brokerId = null, teamId = null) {
    let query = db('leads')
      .select('*')
      .orderBy('name');

    if (brokerId) {
      query = query.where('leads.brokerId', brokerId);
    }

    if (teamId) {
      query = query.whereIn('leads.brokerId', function () {
        this.select('id').from('users').where('teamId', teamId);
      });
    }

    return query;
  }

  async create(data) {
    const [lead] = await db('leads')
      .insert(data)
      .returning('*');

    return lead;
  }

  async findById(id, brokerId = null) {
    let query = db('leads')
      .select('*')
      .where('leads.id', id);

    if (brokerId) {
      query = query.where('leads.brokerId', brokerId);
    }

    return query.first();
  }

  async findByIdForTeamLeader(id, leaderId, teamId) {
    return db('leads')
      .select('*')
      .where('leads.id', id)
      .andWhere(function () {
        this.where('leads.brokerId', leaderId)
          .orWhereIn('leads.brokerId', function () {
            this.select('id').from('users').where('teamId', teamId);
          });
      })
      .first();
  }

  async update(id, data, brokerId = null) {
    let query = db('leads').where({ id });

    if (brokerId) {
      query = query.where('brokerId', brokerId);
    }

    const [lead] = await query
      .update(data)
      .returning('*');

    return lead;
  }

  async updateForTeamLeader(id, data, leaderId, teamId) {
    const lead = await db('leads')
      .where('id', id)
      .andWhere(function () {
        this.where('brokerId', leaderId)
          .orWhereIn('brokerId', function () {
            this.select('id').from('users').where('teamId', teamId);
          });
      })
      .first();

    if (!lead) return null;

    const [updatedLead] = await db('leads')
      .where({ id })
      .update({
        ...data,
        updatedAt: db.fn.now()
      })
      .returning('*');

    return updatedLead;
  }

  async delete(id, brokerId = null) {
    let query = db('leads').where({ id });

    if (brokerId) {
      query = query.where('brokerId', brokerId);
    }

    await query.delete();
  }

  async deleteForTeamLeader(id, leaderId, teamId) {
    await db('leads')
      .where('id', id)
      .andWhere(function () {
        this.where('brokerId', leaderId)
          .orWhereIn('brokerId', function () {
            this.select('id').from('users').where('teamId', teamId);
          });
      })
      .delete();
  }
}