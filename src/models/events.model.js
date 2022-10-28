const { strParseIn, capFirst } = require('../utils/utility-functions');

async function getEventsFromCurrentMonth (knex, params) {
  const { userid, currentmonth } = params;
  try {
    const currentMonthEvents = await knex.select('*')
      .from('events')
      .where('user_id', '=', userid)
      .andWhere(knex.raw(`extract(month from start_date) = ${currentmonth}`))
      .orderBy('start_date')
      .returning('*');

    const formattedCurrentMonthEvents = currentMonthEvents.map(event => ({
      eventId: event.event_id,
      title: capFirst(event.title),
			startDate: event.start_date,
      endDate: event.end_date,
    }))

    console.log('formattedCurrentMonthEvents: ', formattedCurrentMonthEvents)

    return formattedCurrentMonthEvents; 
  } catch (error) {
    throw new Error(`There was an error when trying to get the current month events: ${error}`) 
  }
}

async function getTodayEvents (knex, params) {
  const { userid, nowdate } = params;
  const clientDateNow = new Date(nowdate);
  const timezoneOffset = clientDateNow.getTimezoneOffset()/60;

  try {
    const todayEvents = await knex.select('*')
      .from('events')
      .where('user_id', '=', userid)
      .andWhere(knex.raw(`start_date >= now()::timestamp - interval '${timezoneOffset}' and start_date < current_date::timestamp + interval '1 day' - interval '${timezoneOffset}' `))
      .orderBy('start_date')
      .returning('*');

    const formattedTodayEvents = todayEvents.map(event => ({
      eventId: event.event_id,
      title: capFirst(event.title),
      startDate: event.start_date,
      endDate: event.end_date,
    }))

    console.log('formattedTodayEvents: ', formattedTodayEvents)

    return formattedTodayEvents;
  } catch (error) {
    throw new Error(`There was an error when trying to get the today events: ${error}`);
  }
}

async function postEvent (knex, params, eventData) {
  const { userid, eventid } = params;
  const {
    title,
    startDate,
    endDate,
		auto_generated,
  } = eventData;

  try {
    const event = await knex.insert({
      ... eventid ? { event_id: eventid } : {},
      user_id: userid,
      title: strParseIn(title), 
      start_date: startDate,
      end_date: endDate || null,
      ... auto_generated ? { auto_generated } : {},
    })
      .into('events')
      .onConflict('event_id')
      .merge()
      .returning('*');

    const formattedEvent = {
      eventId: event[0].event_id,
      title: capFirst(event[0].title),
      startDate: event[0].start_date,
      endDate: event[0].end_date || null,
    };

    console.log('formattedEvent: ', formattedEvent);

    return formattedEvent; 
  } catch (error) {
    throw new Error(`There was an error when trying to post or update the event: ${error}`);
  }
}

async function deleteEvent (knex, params) {
  const { userid, eventid } = params;

  try {
    const deletedEvent = await knex('events')
      .where('user_id', '=', userid)
      .andWhere('event_id', '=', eventid)
      .del()
      .returning('*')

    console.log('deletedEvent: ', deletedEvent);

    return deletedEvent;
  } catch (error) {
    throw new Error (`there was an error when trying to delete the event: ${error}`)
  }
}

module.exports = {
  getEventsFromCurrentMonth,
  getTodayEvents,
  postEvent,
  deleteEvent
}
