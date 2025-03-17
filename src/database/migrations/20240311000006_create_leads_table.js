export function up(knex) {
  return knex.schema
    .createTable('leads', (table) => {
      table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
      table.string('name');
      table.string('phone').notNullable().unique();
      table.specificType('developmentsInterest', 'text[]').notNullable();
      table.uuid('brokerId').notNullable().references('id').inTable('users').onDelete('RESTRICT');
      table.timestamp('createdAt').notNullable().defaultTo(knex.fn.now());
      table.timestamp('updatedAt').notNullable().defaultTo(knex.fn.now());
      table.timestamp('lastContact');
    });
}

export function down(knex) {
  return knex.schema.dropTable('leads');
}