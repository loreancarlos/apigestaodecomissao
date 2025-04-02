import db from '../database/connection.js';
import { wsManager } from '../websocket/websocketServer.js';
import { GoogleCalendarService } from './googleCalendar.service.js';

export class BusinessService {
  constructor() {
    this.googleCalendarService = new GoogleCalendarService();
  }

  async list(brokerId = null, teamId = null) {
    let query = db('business')
      .select(
        'business.*',
        'leads.name as leadName',
        'leads.phone as leadPhone',
        'users.name as brokerName',
        'developments.name as developmentName'
      )
      .leftJoin('leads', 'leads.id', 'business.leadId')
      .leftJoin('users', 'users.id', 'leads.brokerId')
      .leftJoin('developments', 'developments.id', 'business.developmentId')
      .orderBy('business.createdAt', 'desc');

    if (brokerId) {
      query = query.where('leads.brokerId', brokerId);
    }

    if (teamId) {
      query = query.whereIn('leads.brokerId', function () {
        this.select('id').from('users').where('teamId', teamId);
      });
    }

    return query;
  }

  async create(data) {
    const [business] = await db('business')
      .insert(data)
      .returning('*');

    // Buscar dados completos do business para enviar na notificação
    const businessComplete = await this.findById(business.id);

    // Notificar todos os clientes conectados sobre o novo business
    wsManager.broadcastUpdate('NEW_BUSINESS', businessComplete);

    return businessComplete;
  }

  async findByLeadId(id) {
    return db('business')
      .select(
        'business.*',
        'leads.name as leadName',
        'leads.phone as leadPhone',
        'users.name as brokerName',
        'developments.name as developmentName'
      )
      .leftJoin('leads', 'leads.id', 'business.leadId')
      .leftJoin('users', 'users.id', 'leads.brokerId')
      .leftJoin('developments', 'developments.id', 'business.developmentId')
      .where('business.leadId', id);
  }

  async findById(id, brokerId = null) {
    let query = db('business')
      .select(
        'business.*',
        'leads.name as leadName',
        'leads.phone as leadPhone',
        'users.name as brokerName',
        'developments.name as developmentName'
      )
      .leftJoin('leads', 'leads.id', 'business.leadId')
      .leftJoin('users', 'users.id', 'leads.brokerId')
      .leftJoin('developments', 'developments.id', 'business.developmentId')
      .where('business.id', id);

    if (brokerId) {
      query = query.where('leads.brokerId', brokerId);
    }

    return query.first();
  }

  async findByIdForTeamLeader(id, leaderId, teamId) {
    return db('business')
      .select(
        'business.*',
        'leads.name as leadName',
        'leads.phone as leadPhone',
        'users.name as brokerName',
        'developments.name as developmentName'
      )
      .leftJoin('leads', 'leads.id', 'business.leadId')
      .leftJoin('users', 'users.id', 'leads.brokerId')
      .leftJoin('developments', 'developments.id', 'business.developmentId')
      .where('business.id', id)
      .andWhere(function () {
        this.where('leads.brokerId', leaderId)
          .orWhereIn('leads.brokerId', function () {
            this.select('id').from('users').where('teamId', teamId);
          });
      })
      .first();
  }

  async update(id, data) {
    const currentBusiness = await this.findById(id);
    if (!currentBusiness) {
      throw new Error('Business not found');
    }

    // Get the broker's Google Calendar settings
    const lead = await db('leads')
      .where({ id: currentBusiness.leadId })
      .first();

    if (!lead) {
      throw new Error('Lead not found');
    }

    const broker = await db('users')
      .where({ id: lead.brokerId })
      .first();

    // Handle Google Calendar event
    if (broker?.google_calendar_token && broker?.google_calendar_id) {
      const development = await db('developments')
        .where({ id: currentBusiness.developmentId })
        .first();

      // If status is changing from scheduled to something else, delete the event
      if (currentBusiness.status === 'scheduled' && data.status !== 'scheduled' && currentBusiness.google_calendar_event_id) {
        try {
          await this.googleCalendarService.deleteEvent(
            broker.google_calendar_token,
            broker.google_calendar_id,
            currentBusiness.google_calendar_event_id
          );
          data.google_calendar_event_id = null;
        } catch (error) {
          console.error('Error deleting calendar event:', error);
        }
      }
      // If status is changing to scheduled or updating scheduled time
      else if (data.status === 'scheduled' && data.scheduledAt) {
        const eventData = {
          summary: `Visita - ${lead.name} - ${development.name}`,
          description: `Número: ${lead.phone} | ${data.notes || 'Visita agendada'}`,
          startDateTime: data.scheduledAt,
          endDateTime: new Date(new Date(data.scheduledAt).getTime() + 60 * 60 * 1000).toISOString(), // 1 hour duration
        };
        try {
          if (currentBusiness.google_calendar_event_id) {
            // Update existing event
            const updatedEvent = await this.googleCalendarService.updateEvent(
              broker.google_calendar_token,
              broker.google_calendar_id,
              currentBusiness.google_calendar_event_id,
              eventData
            );
            data.google_calendar_event_id = updatedEvent.id;
          } else {
            // Create new event
            const newEvent = await this.googleCalendarService.createEvent(
              broker.google_calendar_token,
              broker.google_calendar_id,
              eventData
            );
            data.google_calendar_event_id = newEvent.id;
          }
        } catch (error) {
          console.error('Error managing calendar event:', error);
        }
      }
    }

    const [business] = await db('business')
      .where({ id })
      .update({
        source: data.source,
        status: data.status,
        scheduledAt: data.scheduledAt,
        recallAt: data.recallAt,
        notes: data.notes,
        updatedAt: db.fn.now(),
        lastCallAt: data.lastCallAt,
        google_calendar_event_id: data.google_calendar_event_id,
      })
      .returning('*');

    if (!business) return null;

    return this.findById(business.id);
  }

  async delete(id, brokerId = null) {
    const business = await this.findById(id);
    if (!business) {
      throw new Error('Business not found');
    }

    // Delete Google Calendar event if it exists
    if (business.google_calendar_event_id) {
      const lead = await db('leads')
        .where({ id: business.leadId })
        .first();

      if (lead) {
        const broker = await db('users')
          .where({ id: lead.brokerId })
          .first();

        if (broker?.google_calendar_token && broker?.google_calendar_id) {
          try {
            await this.googleCalendarService.deleteEvent(
              broker.google_calendar_token,
              broker.google_calendar_id,
              business.google_calendar_event_id
            );
          } catch (error) {
            console.error('Error deleting calendar event:', error);
          }
        }
      }
    }

    let query = db('business').where({ id });

    if (brokerId) {
      query = query.whereIn('leadId', function () {
        this.select('id').from('leads').where('brokerId', brokerId);
      });
    }

    await query.delete();
  }
}