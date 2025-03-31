import db from '../database/connection.js';

export class CallModeSessionService {
   async create(data) {
      const [session] = await db('callModeSessions')
         .insert(data)
         .returning('*');

      return session;
   }

   async list() {
      return db('callModeSessions')
         .select('*')
         .orderBy('createdAt', 'desc');
   }

   async update(id, data) {
      const [session] = await db('callModeSessions')
         .where({ id })
         .update(data)
         .returning('*');

      return session;
   }
}