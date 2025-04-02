/*
  # Add Google Calendar Event ID to business table

  1. Changes
    - Add google_calendar_event_id column to business table

  2. Purpose
    - Store Google Calendar event ID for each scheduled business appointment
    - Enable updating and deleting calendar events when business status changes
*/

export function up(knex) {
   return knex.schema.alterTable('business', (table) => {
      table.text('google_calendar_event_id');
   });
}

export function down(knex) {
   return knex.schema.alterTable('business', (table) => {
      table.dropColumn('google_calendar_event_id');
   });
}