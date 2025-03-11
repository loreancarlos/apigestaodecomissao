import db from '../database/connection.js';
import { formatPhone } from '../utils/format.js';

export class LeadService {
  async list(brokerId = null, teamId = null) {
    let query = db('leads')
      .select(
        'leads.*',
        'users.name as brokerName'
      )
      .leftJoin('users', 'users.id', 'leads.brokerId')
      .orderBy('leads.createdAt', 'desc');

    if (brokerId) {
      query = query.where('leads.brokerId', brokerId);
    }

    if (teamId) {
      query = query.whereIn('leads.brokerId', function() {
        this.select('id').from('users').where('teamId', teamId);
      });
    }

    const leads = await query;
    return leads.map(lead => ({
      ...lead,
      phone: formatPhone(lead.phone)
    }));
  }

  async create(data) {
    const [lead] = await db('leads')
      .insert({
        ...data,
        phone: data.phone.replace(/\D/g, '')
      })
      .returning('*');

    return {
      ...lead,
      phone: formatPhone(lead.phone)
    };
  }

  async findById(id, brokerId = null) {
    let query = db('leads')
      .select(
        'leads.*',
        'users.name as brokerName'
      )
      .leftJoin('users', 'users.id', 'leads.brokerId')
      .where('leads.id', id);

    if (brokerId) {
      query = query.where('leads.brokerId', brokerId);
    }

    const lead = await query.first();
    if (!lead) return null;

    return {
      ...lead,
      phone: formatPhone(lead.phone)
    };
  }

  async findByIdForTeamLeader(id, leaderId, teamId) {
    const lead = await db('leads')
      .select(
        'leads.*',
        'users.name as brokerName'
      )
      .leftJoin('users', 'users.id', 'leads.brokerId')
      .where('leads.id', id)
      .andWhere(function() {
        this.where('leads.brokerId', leaderId)
          .orWhereIn('leads.brokerId', function() {
            this.select('id').from('users').where('teamId', teamId);
          });
      })
      .first();

    if (!lead) return null;

    return {
      ...lead,
      phone: formatPhone(lead.phone)
    };
  }

  async update(id, data, brokerId = null) {
    let query = db('leads').where({ id });

    if (brokerId) {
      query = query.where('brokerId', brokerId);
    }

    if (data.phone) {
      data.phone = data.phone.replace(/\D/g, '');
    }

    const [lead] = await query
      .update({
        ...data,
        updatedAt: db.fn.now()
      })
      .returning('*');

    if (!lead) return null;

    return {
      ...lead,
      phone: formatPhone(lead.phone)
    };
  }

  async updateForTeamLeader(id, data, leaderId, teamId) {
    const lead = await db('leads')
      .where('id', id)
      .andWhere(function() {
        this.where('brokerId', leaderId)
          .orWhereIn('brokerId', function() {
            this.select('id').from('users').where('teamId', teamId);
          });
      })
      .first();

    if (!lead) return null;

    if (data.phone) {
      data.phone = data.phone.replace(/\D/g, '');
    }

    const [updatedLead] = await db('leads')
      .where({ id })
      .update({
        ...data,
        updatedAt: db.fn.now()
      })
      .returning('*');

    return {
      ...updatedLead,
      phone: formatPhone(updatedLead.phone)
    };
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
      .andWhere(function() {
        this.where('brokerId', leaderId)
          .orWhereIn('brokerId', function() {
            this.select('id').from('users').where('teamId', teamId);
          });
      })
      .delete();
  }

  async updateStatus(id, status, brokerId = null) {
    let query = db('leads').where({ id });

    if (brokerId) {
      query = query.where('brokerId', brokerId);
    }

    const [lead] = await query
      .update({
        status,
        lastContact: db.fn.now(),
        updatedAt: db.fn.now()
      })
      .returning('*');

    if (!lead) return null;

    return {
      ...lead,
      phone: formatPhone(lead.phone)
    };
  }

  async updateStatusForTeamLeader(id, status, leaderId, teamId) {
    const lead = await db('leads')
      .where('id', id)
      .andWhere(function() {
        this.where('brokerId', leaderId)
          .orWhereIn('brokerId', function() {
            this.select('id').from('users').where('teamId', teamId);
          });
      })
      .update({
        status,
        lastContact: db.fn.now(),
        updatedAt: db.fn.now()
      })
      .returning('*')
      .then(rows => rows[0]);

    if (!lead) return null;

    return {
      ...lead,
      phone: formatPhone(lead.phone)
    };
  }
}