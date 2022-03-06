const fs = require('fs-extra');
const bcrypt = require('bcrypt');
const { usersDir } = require('../utils/constants');
const { strParseIn } = require('../utils/utility-functions');
const Joi = require('joi');
const { DbError, DuplicateDataError } = require('../errors/db-errors');
const { UNIQUE_VIOLATION } = require('pg-error-constants');

const signUpHandler = knex => (req, res) => {

  const {
    names,
    email,
    password,
    confirmPassword
  } = req.body;

  const validationSchema = Joi.object({
    names: Joi.string().pattern(/^[a-zA-Z\s]+$/).max(50).required()
    .messages({ 'string.pattern.base': 'invalid character, only letters are allowed' }),
    email: Joi.string().email().required(),
    password: Joi.string().alphanum().strip().required(),
    confirmPassword: Joi.ref('password'),
  });

  const { error, value } = validationSchema.validate({
    names,
    email,
    password,
    confirmPassword
  }, { abortEarly: false })

  if (error) return res.status(400).json({ validationErrors: error.details })

  const saltRounds = 10;

  (async function () {

    const hashedPwd = await bcrypt.hash(password, saltRounds);

    try {

      const newUser = await knex.insert({
        names: strParseIn(names), // TODO: this should be username
        email,
        password: hashedPwd
      })
      .into('users')
      .returning('*')

      await fs.mkdir(`${usersDir}/${newUser[0].user_id}`);
      await fs.mkdir(`${usersDir}/${newUser[0].user_id}/pictures`);
      await fs.mkdir(`${usersDir}/${newUser[0].user_id}/pictures/l`);
      await fs.mkdir(`${usersDir}/${newUser[0].user_id}/pictures/s`);

      res.status(200).json({ userId: newUser[0].user_id, names, email })

    } catch (err) {
      if (err.code === UNIQUE_VIOLATION && err.constraint === 'agents_email_key') {
        return res.status(400).json({ duplicateEntityError: 'email already exists' })
      }
      throw new Error(`We couldn't register the user, reason: ${err}`)
    }

  })()

}

module.exports = {
  signUpHandler
}
