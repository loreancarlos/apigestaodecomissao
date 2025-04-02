export class GoogleCalendarService {
  async createEvent(accessToken, calendarId, data) {
    try {
      const event = {
        summary: data.summary,
        description: data.description,
        start: {
          dateTime: new Date(data.startDateTime).toISOString(),
          timeZone: 'America/Sao_Paulo',
        },
        end: {
          dateTime: new Date(data.endDateTime).toISOString(),
          timeZone: 'America/Sao_Paulo',
        },
      };

      const response = await fetch(
        `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendarId)}/events`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(event),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Google Calendar API Error:', errorData);
        throw new Error(errorData.error?.message || 'Failed to create calendar event');
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Error creating calendar event:', error);
      throw error;
    }
  }

  async updateEvent(accessToken, calendarId, eventId, data) {
    try {
      const event = {
        summary: data.summary,
        description: data.description,
        start: {
          dateTime: new Date(data.startDateTime).toISOString(),
          timeZone: 'America/Sao_Paulo',
        },
        end: {
          dateTime: new Date(data.endDateTime).toISOString(),
          timeZone: 'America/Sao_Paulo',
        },
      };

      const response = await fetch(
        `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendarId)}/events/${encodeURIComponent(eventId)}`,
        {
          method: 'PATCH',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(event),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Google Calendar API Error:', errorData);
        throw new Error(errorData.error?.message || 'Failed to update calendar event');
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Error updating calendar event:', error);
      throw error;
    }
  }

  async deleteEvent(accessToken, calendarId, eventId) {
    try {
      const response = await fetch(
        `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendarId)}/events/${encodeURIComponent(eventId)}`,
        {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
          },
        }
      );

      if (!response.ok && response.status !== 404) {
        const errorData = await response.json();
        console.error('Google Calendar API Error:', errorData);
        throw new Error(errorData.error?.message || 'Failed to delete calendar event');
      }

      return true;
    } catch (error) {
      console.error('Error deleting calendar event:', error);
      throw error;
    }
  }
}