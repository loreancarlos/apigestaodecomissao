export function up(knex) {
  return knex.schema
    .createTable('teams', (table) => {
      table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
      table.string('name').notNullable();
      table.uuid('leaderId').notNullable().references('id').inTable('users').onDelete('RESTRICT');
      table.timestamp('createdAt').notNullable().defaultTo(knex.fn.now());
      table.timestamp('updatedAt').notNullable().defaultTo(knex.fn.now());
    })
    .then(() => {
      return knex.schema.alterTable('users', (table) => {
        table.uuid('teamId').references('id').inTable('teams').onDelete('SET NULL');
      });
    });
}

export function down(knex) {
  return knex.schema.alterTable('users', (table) => {
    table.dropColumn('teamId');
  }).then(() => {
    return knex.schema.dropTable('teams');
  });
}