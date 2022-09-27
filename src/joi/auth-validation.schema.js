const Joi = require('joi');

const signinValidationSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.required().strip()
});

function signupValidationSchema (t) {
  return Joi.object({
    names: Joi.string().pattern(/^[a-zA-ZñÑáéíóúüÁÉÍÓÚ\s]+$/).max(50).required()
      .messages({ 'string.pattern.base': t('lettersOnlyAllowed') }),
    email: Joi.string().email().required(),
    contactPhone: Joi.number(),
    password: Joi.string().pattern(/^[0-9a-zA-ZñÑáéíóúüÁÉÍÓÚ\.\:\;\,\s]+$/).strip().required(),
    confirmPassword: Joi.any().valid(Joi.ref('password'))
      .messages({ 'any.only': t('passwordsMustMatch') })
  });
} 

module.exports = {
  signinValidationSchema,
  signupValidationSchema,
}
