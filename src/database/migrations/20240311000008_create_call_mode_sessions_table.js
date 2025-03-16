export function up(knex) {
   return knex.schema.createTable('callModeSessions', (table) => {
      table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
      table.uuid('userId').notNullable().references('id').inTable('users').onDelete('CASCADE');
      table.timestamp('startTime').notNullable();
      table.timestamp('endTime').notNullable();
      table.specificType('leadsViewed', 'text[]').notNullable();
      table.timestamp('createdAt').notNullable().defaultTo(knex.fn.now());
      table.timestamp('updatedAt').notNullable().defaultTo(knex.fn.now());
   });
}

export function down(knex) {
   return knex.schema.dropTable('callModeSessions');
}