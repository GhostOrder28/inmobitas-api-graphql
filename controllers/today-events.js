const { capFirst } = require('../utils/utility-functions');

const todayEventsHandler = knex => (req, res) => {
  const { userid } = req.params;
  (async function () {
    const eventsData = await knex.select('*')
      .from('events')
      .where('user_id', '=', userid)
      .andWhere(knex.raw(`start_date > date_trunc('minute', now())`))
      .orderBy('start_date')
      .returning('*');

    console.log('eventsData: ', eventsData);

    const payload = eventsData.map(event => ({
      eventId: event.event_id,
      title: capFirst(event.title),
      startDate: event.start_date,
      endDate: event.end_date,
    }))

    console.log('payload: ', payload)

    res.status(200).json(payload);
  })();
}

module.exports = {
  todayEventsHandler
}
