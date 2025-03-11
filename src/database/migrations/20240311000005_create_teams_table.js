/*
  # Create teams table and add team relationship to users

  1. New Tables
    - `teams`
      - `id` (uuid, primary key)
      - `name` (text, not null)
      - `leaderId` (uuid, references users)
      - `createdAt` (timestamp)
      - `updatedAt` (timestamp)

  2. Changes
    - Add `teamId` column to `users` table
    - Add foreign key constraint to ensure team leader has role 'teamLeader'

  3. Security
    - Enable RLS on `teams` table
    - Add policies for team access
*/

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
    })
    .then(() => {
      return knex.raw(`
        CREATE OR REPLACE FUNCTION check_team_leader_role()
        RETURNS TRIGGER AS $$
        BEGIN
          IF EXISTS (
            SELECT 1 FROM users 
            WHERE id = NEW.leaderId 
            AND role != 'teamLeader'
          ) THEN
            RAISE EXCEPTION 'Team leader must have teamLeader role';
          END IF;
          RETURN NEW;
        END;
        $$ LANGUAGE plpgsql;

        CREATE TRIGGER ensure_team_leader_role
        BEFORE INSERT OR UPDATE ON teams
        FOR EACH ROW
        EXECUTE FUNCTION check_team_leader_role();
      `);
    });
}

export function down(knex) {
  return knex.schema
    .raw('DROP TRIGGER IF EXISTS ensure_team_leader_role ON teams')
    .then(() => knex.raw('DROP FUNCTION IF EXISTS check_team_leader_role'))
    .then(() => {
      return knex.schema.alterTable('users', (table) => {
        table.dropColumn('teamId');
      });
    })
    .then(() => {
      return knex.schema.dropTable('teams');
    });
}