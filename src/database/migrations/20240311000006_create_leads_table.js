/*
  # Create leads table

  1. New Tables
    - `leads`
      - `id` (uuid, primary key)
      - `name` (text, not null)
      - `email` (text)
      - `phone` (text, not null)
      - `source` (enum: 'indication', 'social_media', 'website', 'other')
      - `status` (enum: 'new', 'contacted', 'in_negotiation', 'converted', 'lost')
      - `notes` (text)
      - `brokerId` (uuid, references users)
      - `createdAt` (timestamp)
      - `updatedAt` (timestamp)
      - `lastContact` (timestamp)

  2. Security
    - Enable RLS on `leads` table
    - Add policies for lead access
*/

export function up(knex) {
  return knex.schema
    .createTable('leads', (table) => {
      table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
      table.string('name').notNullable();
      table.string('phone').notNullable();
      table.enum('source', ['indication', 'organic', 'website', 'paidTraffic','other']).notNullable();
      table.enum('status', ['new', 'call', 'whatsapp', 'scheduled','converted', 'lost']).notNullable().defaultTo('new');
      table.text('notes');
      table.uuid('brokerId').notNullable().references('id').inTable('users').onDelete('RESTRICT');
      table.timestamp('createdAt').notNullable().defaultTo(knex.fn.now());
      table.timestamp('updatedAt').notNullable().defaultTo(knex.fn.now());
      table.timestamp('lastContact');
    })
    .then(() => {
      return knex.raw(`
        CREATE OR REPLACE FUNCTION check_broker_teamLeader_role()
        RETURNS TRIGGER AS $$
        BEGIN
          IF EXISTS (
            SELECT 1 FROM users 
            WHERE id = NEW.brokerId 
            AND role NOT IN ('broker', 'teamLeader')
          ) THEN
            RAISE EXCEPTION 'Lead must be assigned to a broker';
          END IF;
          RETURN NEW;
        END;
        $$ LANGUAGE plpgsql;

        CREATE TRIGGER ensure_broker_teamLeader_role
        BEFORE INSERT OR UPDATE ON leads
        FOR EACH ROW
        EXECUTE FUNCTION check_broker_teamLeader_role();
      `);
    });
}

export function down(knex) {
  return knex.schema
    .raw('DROP TRIGGER IF EXISTS ensure_broker_teamLeader_role ON leads')
    .then(() => knex.raw('DROP FUNCTION IF EXISTS check_broker_teamLeader_role'))
    .then(() => {
      return knex.schema.dropTable('leads');
    });
}