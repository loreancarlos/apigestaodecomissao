export function up(knex) {
  return knex.schema.createTable('clients', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.string('name').notNullable();
    table.string('cpf').notNullable().unique();
    table.string('email').notNullable();
    table.string('phone').notNullable();
    table.string('address').notNullable();
    table.timestamp('createdAt').notNullable().defaultTo(knex.fn.now());
    table.timestamp('updatedAt').notNullable().defaultTo(knex.fn.now());
  });
}

export function down(knex) {
  return knex.schema.dropTable('clients');
}
