import db from '../database/connection.js';

export class TeamService {
  async list() {
    return db('teams')
      .select('*')
      .orderBy('name');
  }

  async create(data) {
    const [team] = await db('teams')
      .insert(data)
      .returning('*');
    return team;
  }

  async findById(id) {
    const team = await db('teams')
      .select('*')
      .where({ id })
      .first();

    if (!team) return null;

    const members = await db('users')
      .select('*')
      .where('teamId', id)
      .orderBy('name');

    return { ...team, members };
  }

  async update(id, data) {
    const [team] = await db('teams')
      .where({ id })
      .update({
        ...data,
        updatedAt: db.fn.now()
      })
      .returning('*');

    return team;
  }

  async delete(id) {
    const hasMembers = await db('users')
      .where({ teamId: id })
      .first();

    if (hasMembers) {
      throw new Error('TEAM_HAS_MEMBERS');
    }

    await db('teams')
      .where({ id })
      .delete();
  }

  async addMember(teamId, userId) {
    const [user] = await db('users')
      .where({ id: userId })
      .update({ teamId })
      .returning('*');

    return user;
  }

  async removeMember(userId) {
    const [user] = await db('users')
      .where({ id: userId })
      .update({ teamId: null })
      .returning('*');

    return user;
  }
}