const express = require('express');

const knex = require('../../knex/knex-config');
const {
  httpGetEventsFromCurrentMonth,
  httpGetTodayEvents,
  httpPostEvent,
  httpDeleteEvent
} = require('./events.controller');

const eventsRouter = express.Router();

eventsRouter.get('/:userid/:currentmonth/:currentyear', httpGetEventsFromCurrentMonth(knex));
eventsRouter.get('/:userid/:nowdate', httpGetTodayEvents(knex));
eventsRouter.post('/:userid', httpPostEvent(knex));
eventsRouter.put('/:userid/:eventid', httpPostEvent(knex));
eventsRouter.delete('/:userid/:eventid', httpDeleteEvent(knex));

module.exports = eventsRouter;
