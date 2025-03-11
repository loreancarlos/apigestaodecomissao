export function up(knex) {
  return knex.schema.createTable('users', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.string('name').notNullable();
    table.string('email').notNullable().unique();
    table.string('password').notNullable();
    table.enum('role', ['admin', 'user','broker','teamLeader']).notNullable().defaultTo('user');
    table.boolean('active').notNullable().defaultTo(true);
    table.timestamp('createdAt').notNullable().defaultTo(knex.fn.now());
    table.timestamp('lastLogin');
  });
}

export function down(knex) {
  return knex.schema.dropTable('users');
}
