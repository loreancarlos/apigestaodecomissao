import db from '../database/connection.js';

export class CallModeSessionService {
   async create(data) {
      const [session] = await db('callModeSessions')
         .insert(data)
         .returning('*');

      return session;
   }

   async list(userId) {
      return db('callModeSessions')
         .where({ userId })
         .orderBy('createdAt', 'desc');
   }
}