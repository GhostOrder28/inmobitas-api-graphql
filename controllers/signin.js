const fs = require('fs-extra');
const bcrypt = require('bcrypt');
const { strParseOut, strParseIn } = require('../utils/utility-functions');
const Joi = require('joi');

const signInHandler = knex => (req, res) => {

  const { email, password } = req.body;

  const validationSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.required().strip()
  });


  const { error, value } = validationSchema.validate({ email, password }, { abortEarly: false })
  if (error) return res.status(400).json({ validationErrors: error.details })

  const saltRounds = 10;
  let userId = null;

  (async function () {

    try {
      const getUserData = await knex.select('user_id', 'email', 'password', 'names')
      .from('users')
      .where('email', '=', strParseIn(email))
      .returning('*')

      if (!getUserData.length) return res.status(400).json({ authErrors: 'Wrong credentials' })
      userId = getUserData[0].user_id;

      const match = await bcrypt.compare(password, getUserData[0].password);

      if (match) {
        return res.status(200).json({
          userId,
          names: getUserData[0].names,
          email
        })
      } else {
        return res.status(400).json({ authErrors: 'Wrong credentials' })
      }

    } catch (err) {
      throw new Error(`We couldn't register the user, reason: ${err}`)
    }

  })()

}

module.exports = {
  signInHandler
}
