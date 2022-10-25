const Joi = require('joi');

function clientsValidationSchema (t) {
  return Joi.object({

    clientName: Joi.string().pattern(/^[a-zA-ZñÑáéíóúüÁÉÍÓÚ\s]+$/i).required()
    .messages({
      'string.pattern.base': t('lettersAndSpacesOnlyAllowed'),
      'any.required': t('clientNameRequired')
    }),

    clientContactPhone: Joi.number().required()
    .messages({ 'any.required': t('clientContactPhoneRequired') }),

    clientAge: Joi.number().greater(18).less(80).allow(null)
    .messages({
      'number.less': t('clientShouldBeLessThan'),
      'number.greater': t('clientShouldBeGreaterThan'),
      'any.required': t('clientBadAgeNumber')
    }),

    clientDetails: Joi.string().pattern(/^[0-9a-zA-ZñÑáéíóúüÁÉÍÓÚ\?\'\/\.\:\;\,\s]+$/).allow(null)
    .messages({ 'string.pattern.base': t('detailsAllowedCharacters') }),

    clientType: Joi.string().required()
  });
}

module.exports = {
  clientsValidationSchema
}
