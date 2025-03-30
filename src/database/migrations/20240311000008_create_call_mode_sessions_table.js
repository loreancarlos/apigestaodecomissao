export function up(knex) {
   return knex.schema.createTable('callModeSessions', (table) => {
      table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
      table.uuid('userId').notNullable().references('id').inTable('users').onDelete('CASCADE');
      table.timestamp('startTime').notNullable();
      table.timestamp('endTime').notNullable();
      table.specificType('businessViewed', 'text[]').notNullable();
      table.integer('answeredCalls').notNullable().defaultTo(0);
      table.integer('talkedCalls').notNullable().defaultTo(0);
      table.integer('scheduledCalls').notNullable().defaultTo(0);
      table.integer('whatsappCalls').notNullable().defaultTo(0);
      table.integer('notInterestCalls').notNullable().defaultTo(0);
      table.integer('recallCalls').notNullable().defaultTo(0);
      table.integer('voicemailCalls').notNullable().defaultTo(0);
      table.integer('invalidNumberCalls').notNullable().defaultTo(0);
      table.integer('notReceivingCalls').notNullable().defaultTo(0);
      table.timestamp('createdAt').notNullable().defaultTo(knex.fn.now());
      table.timestamp('updatedAt').notNullable().defaultTo(knex.fn.now());
   });
}

export function down(knex) {
   return knex.schema.dropTable('callModeSessions');
}