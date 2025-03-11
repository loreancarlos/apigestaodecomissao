import bcrypt from 'bcryptjs';
import db from '../database/connection.js';

export class AuthService {
  async validateCredentials(email, password) {
    const user = await db('users').where({ email, active: true }).first();
    if (!user) return null;
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) return null;
    return user;
  }

  async updateLastLogin(userId) {
    await db('users')
      .where({ id: userId })
      .update({ lastLogin: db.fn.now() });
  }

  async changePassword(userId, currentPassword, newPassword) {
    const user = await db('users').where({ id: userId }).first();
    if (!user) return false;

    const isValidPassword = await bcrypt.compare(currentPassword, user.password);
    if (!isValidPassword) return false;

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await db('users')
      .where({ id: userId })
      .update({ password: hashedPassword });

    return true;
  }

  async adminResetPassword(userId, newPassword) {
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await db('users')
      .where({ id: userId })
      .update({ password: hashedPassword });
  }
}