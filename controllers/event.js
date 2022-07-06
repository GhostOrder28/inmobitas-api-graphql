const { strParseIn, capFirst } = require('../utils/utility-functions');
const Joi = require('joi');

const eventHandler = knex => (req, res) => {

  const { userid, eventid } = req.params;
  const {
    title,
    startDate,
    endDate,
  } = req.body;

  const validationSchema = Joi.object({
    title: Joi.string().pattern(/^[0-9a-zA-ZñÑáéíóúüÁÉÍÓÚ\.\:\;\,\s]+$/).required()
    .messages({
      'any.required': req.t('titleRequired')
    }),
    startDate: Joi.date().required(),
    endDate: Joi.date().allow(null),
  })

  const { error, value } = validationSchema.validate({
    title,
    startDate,
    endDate
  }, { abortEarly: false })

  console.log('joi errors: ', error);

  if (error) return res.status(400).json({ validationErrors: error.details });

  (async function () {
    try {
      const eventData = await knex.insert({
        ... eventid ? { event_id: eventid } : {},
        user_id: userid,
        title: strParseIn(title), 
        start_date: startDate,
        end_date: endDate || null,
      })
        .into('events')
        .onConflict('event_id')
        .merge()
        .returning('*')
      
      console.log('eventData: ', eventData);

      const payload = {
        eventId: eventData[0].event_id,
        title: capFirst(eventData[0].title),
        startDate: eventData[0].start_date,
        endDate: eventData[0].end_date || null,
      }

      console.log('payload: ', payload);

      res.status(200).json(payload)

    } catch (err) {
      throw new Error(err)
    } 
  })()
}

module.exports = {
  eventHandler
}
