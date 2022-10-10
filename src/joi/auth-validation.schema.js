const Joi = require('joi');

function signinValidationSchema (t) {
  return Joi.object({
    email: Joi.string().email().required()
      .messages({
        'any.required': t('emailRequired')
      }),
    password: Joi.required().strip()
      .messages({
        'any.required': t('passwordRequired')
      }),
  });
} 
function signupValidationSchema (t) {
  return Joi.object({
    names: Joi.string().pattern(/^[a-zA-ZñÑáéíóúüÁÉÍÓÚ\s]+$/).max(50).required()
      .messages({
        'string.pattern.base': t('lettersOnlyAllowed'),
        'any.required': t('namesRequired')
      }),

    email: Joi.string().email().required()
      .messages({
        'any.required': t('emailRequired')
      }),

    contactPhone: Joi.number(),

    password: Joi.string().pattern(/^[0-9a-zA-ZñÑáéíóúüÁÉÍÓÚ\.\:\;\,\s]+$/).strip().required()
      .messages({
        'any.required': t('passwordRequired')
      }),

    confirmPassword: Joi.any().valid(Joi.ref('password'))
      .messages({
        'any.only': t('passwordsMustMatch')
      })
  });
} 

module.exports = {
  signinValidationSchema,
  signupValidationSchema,
}
