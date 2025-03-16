import db from '../database/connection.js';

export class BusinessService {
   async list(brokerId = null, teamId = null) {
      let query = db('business')
         .select(
            'business.*',
            'leads.name as leadName',
            'leads.phone as leadPhone',
            'users.name as brokerName',
            'developments.name as developmentName'
         )
         .leftJoin('leads', 'leads.id', 'business.leadId')
         .leftJoin('users', 'users.id', 'leads.brokerId')
         .leftJoin('developments', 'developments.id', 'business.developmentId')
         .orderBy('business.createdAt', 'desc');

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
      const [business] = await db('business')
         .insert(data)
         .returning('*');

      return this.findById(business.id);
   }

   async findById(id, brokerId = null) {
      let query = db('business')
         .select(
            'business.*',
            'leads.name as leadName',
            'leads.phone as leadPhone',
            'users.name as brokerName',
            'developments.name as developmentName'
         )
         .leftJoin('leads', 'leads.id', 'business.leadId')
         .leftJoin('users', 'users.id', 'leads.brokerId')
         .leftJoin('developments', 'developments.id', 'business.developmentId')
         .where('business.id', id);

      if (brokerId) {
         query = query.where('leads.brokerId', brokerId);
      }

      return query.first();
   }

   async findByIdForTeamLeader(id, leaderId, teamId) {
      const business = await db('business')
         .select(
            'business.*',
            'leads.name as leadName',
            'leads.phone as leadPhone',
            'users.name as brokerName',
            'developments.name as developmentName'
         )
         .leftJoin('leads', 'leads.id', 'business.leadId')
         .leftJoin('users', 'users.id', 'leads.brokerId')
         .leftJoin('developments', 'developments.id', 'business.developmentId')
         .where('business.id', id)
         .andWhere(function () {
            this.where('leads.brokerId', leaderId)
               .orWhereIn('leads.brokerId', function () {
                  this.select('id').from('users').where('teamId', teamId);
               });
         })
         .first();

      return business;
   }

   async update(id, data, brokerId = null) {
      let query = db('business').where({ id });

      if (brokerId) {
         query = query.whereIn('leadId', function () {
            this.select('id').from('leads').where('brokerId', brokerId);
         });
      }

      const [business] = await query
         .update({
            ...data,
            updatedAt: db.fn.now()
         })
         .returning('*');

      if (!business) return null;

      return this.findById(business.id);
   }

   async updateForTeamLeader(id, data, leaderId, teamId) {
      const business = await db('business')
         .where('id', id)
         .whereIn('leadId', function () {
            this.select('id')
               .from('leads')
               .where(function () {
                  this.where('brokerId', leaderId)
                     .orWhereIn('brokerId', function () {
                        this.select('id').from('users').where('teamId', teamId);
                     });
               });
         })
         .first();

      if (!business) return null;

      const [updatedBusiness] = await db('business')
         .where({ id })
         .update({
            ...data,
            updatedAt: db.fn.now()
         })
         .returning('*');

      return this.findById(updatedBusiness.id);
   }

   async delete(id, brokerId = null) {
      let query = db('business').where({ id });

      if (brokerId) {
         query = query.whereIn('leadId', function () {
            this.select('id').from('leads').where('brokerId', brokerId);
         });
      }

      await query.delete();
   }

   async deleteForTeamLeader(id, leaderId, teamId) {
      await db('business')
         .where('id', id)
         .whereIn('leadId', function () {
            this.select('id')
               .from('leads')
               .where(function () {
                  this.where('brokerId', leaderId)
                     .orWhereIn('brokerId', function () {
                        this.select('id').from('users').where('teamId', teamId);
                     });
               });
         })
         .delete();
   }

   async updateStatus(id, status, brokerId = null) {
      let query = db('business').where({ id });

      if (brokerId) {
         query = query.whereIn('leadId', function () {
            this.select('id').from('leads').where('brokerId', brokerId);
         });
      }

      const [business] = await query
         .update({
            status,
            updatedAt: db.fn.now()
         })
         .returning('*');

      if (!business) return null;

      return this.findById(business.id);
   }

   async updateStatusForTeamLeader(id, status, leaderId, teamId) {
      const business = await db('business')
         .where('id', id)
         .whereIn('leadId', function () {
            this.select('id')
               .from('leads')
               .where(function () {
                  this.where('brokerId', leaderId)
                     .orWhereIn('brokerId', function () {
                        this.select('id').from('users').where('teamId', teamId);
                     });
               });
         })
         .update({
            status,
            updatedAt: db.fn.now()
         })
         .returning('*')
         .then(rows => rows[0]);

      if (!business) return null;

      return this.findById(business.id);
   }
}