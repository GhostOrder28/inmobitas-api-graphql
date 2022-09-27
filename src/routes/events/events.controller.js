const {
  getEventsFromCurrentMonth,
  getTodayEvents,
  postEvent,
  deleteEvent,
} = require('../../models/events.model');

const { eventValidationSchema } = require('../../joi/events-validation.schema');

function httpGetEventsFromCurrentMonth (knex) {
  return async (req, res) => {
    const params = req.params;
    try {
      const currentMonthEvents = await getEventsFromCurrentMonth(knex, params);
      return res.status(200).json(currentMonthEvents);
    } catch (error) {
      throw new Error(`There is an error, ${error}`);
    }
  }

}
function httpGetTodayEvents (knex) {
  return async (req, res) => {
    const params = req.params;
    try {
      const todayEvents = await getTodayEvents(knex, params);
      return res.status(200).json(todayEvents);
    } catch (error) {
      throw new Error(`There is an error, ${error}`);
    }
  }
}
function httpPostEvent (knex) {
  return async (req, res) => {
    const params = req.params;
    const eventData = req.body;
    const t = req.t;
    try {
      const { error } = eventValidationSchema(t).validate(eventData, { abortEarly: false })
      if (error) return res.status(400).json({ validationErrors: error.details });

      const event = await postEvent(knex, params, eventData);
      return res.status(200).json(event);
    } catch (error) {
      throw new Error(`There is an error, ${error}`);
    }
  }
}
function httpDeleteEvent (knex) {
  return async (req, res) => {
    const params = req.params;
    try {
      const deletedEvent = await deleteEvent(knex, params);
      return res.status(200).json(deletedEvent);
    } catch (error) {
      throw new Error(`There is an error, ${error}`);
    }
  }
}

module.exports = {
  httpGetEventsFromCurrentMonth,
  httpGetTodayEvents,
  httpPostEvent,
  httpDeleteEvent,
}
