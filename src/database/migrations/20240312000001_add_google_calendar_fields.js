/*
  # Add Google Calendar fields to users table

  1. Changes
    - Add google_calendar_token column to users table
    - Add google_calendar_id column to users table

  2. Purpose
    - Store Google Calendar access token for each user
    - Store selected Google Calendar ID for each user
*/

export function up(knex) {
  return knex.schema.alterTable('users', (table) => {
    table.text('google_calendar_token');
    table.text('google_calendar_id');
    table.text('google_calendar_refresh_token');
  });
}

export function down(knex) {
  return knex.schema.alterTable('users', (table) => {
    table.dropColumn('google_calendar_token');
    table.dropColumn('google_calendar_id');
    table.dropColumn('google_calendar_refresh_token');
  });
}