const bcrypt = require('bcrypt');

const { signup } = require('../../models/signup.model');
const { signupValidationSchema } = require('../../joi/auth-validation.schemas');

function httpSignup (knex) {
  return async (req, res) => {
    const signupData = req.body;

    try {
      const { error } = signupValidationSchema(req.t).validate(signupData, { abortEarly: false })
      if (error) return res.status(400).json({ validationErrors: error.details })

      const saltRounds = 10;
      signupData.hashedPwd = await bcrypt.hash(signupData.password, saltRounds);

      const signupResponse = await signup(knex, signupData, req.t);
      return res.status(200).json(signupResponse);
    } catch (error) {
      return res.status(400).json({ duplicateEntityError: error.message });
    }
  }
}

module.exports = {
  httpSignup
}
