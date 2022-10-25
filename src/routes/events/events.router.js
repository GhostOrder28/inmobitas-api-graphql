const express = require('express');

const {
  httpGetEventsFromCurrentMonth,
  httpGetTodayEvents,
  httpPostEvent,
  httpDeleteEvent
} = require('./events.controller');

const eventsRouter = express.Router();

eventsRouter.get('/:userid/:currentmonth/:currentyear', httpGetEventsFromCurrentMonth());
eventsRouter.get('/:userid/:nowdate', httpGetTodayEvents());
eventsRouter.post('/:userid', httpPostEvent());
eventsRouter.put('/:userid/:eventid', httpPostEvent());
eventsRouter.delete('/:userid/:eventid', httpDeleteEvent());

module.exports = eventsRouter;
