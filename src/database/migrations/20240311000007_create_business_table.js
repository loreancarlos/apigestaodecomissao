export function up(knex) {
   return knex.schema
      .createTable('business', (table) => {
         table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
         table.uuid('leadId').notNullable().references('id').inTable('leads').onDelete('CASCADE');
         table.uuid('developmentId').notNullable().references('id').inTable('developments').onDelete('CASCADE');
         table.enum('source', ['indication', 'organic', 'website', 'paidTraffic', 'doorToDoor', 'tent', 'importedList']).notNullable();
         table.enum('status', ['new', 'recall', 'whatsapp', 'scheduled', 'lost']).notNullable().defaultTo('new');
         table.timestamp('scheduledAt');
         table.timestamp('recallAt');
         table.timestamp('lastCallAt');
         table.text('notes');
         table.timestamp('createdAt').notNullable().defaultTo(knex.fn.now());
         table.timestamp('updatedAt').notNullable().defaultTo(knex.fn.now());

         // Add a unique constraint to prevent duplicate tags
         table.unique(['leadId', 'developmentId']);
      });
}


export function down(knex) {
   return knex.schema.dropTable('business');
}


