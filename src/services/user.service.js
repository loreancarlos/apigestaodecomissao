import bcrypt from 'bcryptjs';
import db from '../database/connection.js';

export class UserService {
  async list() {
    return db('users')
      .select('*');
  }

  async create(data) {
    const hashedPassword = await bcrypt.hash(data.password, 10);

    const [user] = await db('users')
      .insert({
        ...data,
        password: hashedPassword
      })
      .returning('*');

    return user;
  }

  async findById(id) {
    return db('users')
      .where({ id })
      .select('*')
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
      .returning('*');

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
      .returning('*');

    return user;
  }

  async updateGoogleCalendar(id, data) {
    const [user] = await db('users')
      .where({ id })
      .update({
        google_calendar_token: data.accessToken || db.raw('google_calendar_token'),
        google_calendar_id: data.selectedCalendarId === null ? null : (data.selectedCalendarId || db.raw('google_calendar_id'))
      })
      .returning('*');

    return user;
  }
}