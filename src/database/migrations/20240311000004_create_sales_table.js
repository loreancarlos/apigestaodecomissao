export function up(knex) {
  return knex.schema.createTable('sales', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('clientId').notNullable().references('id').inTable('clients').onDelete('RESTRICT');
    table.uuid('secondBuyerId').references('id').inTable('clients').onDelete('RESTRICT');
    table.uuid('developmentId').notNullable().references('id').inTable('developments').onDelete('RESTRICT');
    table.uuid('brokerId').notNullable().references('id').inTable('users').onDelete('RESTRICT');
    table.string('blockNumber').notNullable();
    table.string('lotNumber').notNullable();
    table.decimal('totalValue', 12, 2).notNullable();
    table.integer('downPaymentInstallments').notNullable();
    table.date('purchaseDate').notNullable();
    table.decimal('commissionValue', 12, 2).notNullable();
    table.enum('status', [
      'paid',
      'canceled',
      'waiting_contract',
      'waiting_down_payment',
      'waiting_seven_days',
      'waiting_invoice'
    ]).notNullable().defaultTo('waiting_contract');
    table.timestamp('createdAt').notNullable().defaultTo(knex.fn.now());
    table.timestamp('updatedAt').notNullable().defaultTo(knex.fn.now());
  });
}

export function down(knex) {
  return knex.schema.dropTable('sales');
}
