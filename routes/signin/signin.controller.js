const bcrypt = require('bcrypt');

const { signin } = require('../../models/signin.model');
const { signinValidationSchema } = require('../../joi/auth-validation.schemas');

function httpSignin (knex) {
  return async (req, res) => {
    const { email, password } = req.body;
    try {
      const { error } = signinValidationSchema.validate({ email, password }, { abortEarly: false });
      if (error) return res.status(400).json({ validationErrors: error.details });

      const signinData = await signin(knex, email);

      if (!signinData.length) return res.status(400).json({ authErrors: req.t('wrongCredentials')})
      const match = await bcrypt.compare(password, signinData[0].password);
      if (match) {
        return res.status(200).json({
          userId: signinData[0].user_id,
          names: signinData[0].names,
          email: signinData[0].email
        })
      } else {
        return res.status(400).json({ authErrors: req.t('wrongCredentials')})
      }
    } catch (error) {
      throw new Error(`We couldn't sign in the user, reason: ${error}`)
    }
  }
}

module.exports = {
  httpSignin
}
