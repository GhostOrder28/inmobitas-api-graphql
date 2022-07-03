const { capFirst } = require('../utils/utility-functions');

const eventsHandler = knex => (req, res) => {
  const { userid } = req.params;
  console.log('params: ', req.params);
  (async function () {
    const eventsData = await knex.select('*')
      .from('events')
      .where('user_id', '=', userid)
      .andWhere(knex.raw(`extract(month from start_date) = ${req.params.currentmonth}`))
      .orderBy('start_date')
      .returning('*');

    //console.log('eventsData: ', eventsData);

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
  eventsHandler
}
