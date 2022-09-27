const Joi = require('joi');

function eventValidationSchema (t) {
  return Joi.object({
    title: Joi.string().pattern(/^[0-9a-zA-ZñÑáéíóúüÁÉÍÓÚ\.\:\;\,\s]+$/).required()
    .messages({
      'any.required': t('titleRequired')
    }),
    startDate: Joi.date().required(),
    endDate: Joi.date().allow(null),
  })
} 

module.exports = {
  eventValidationSchema,
}
