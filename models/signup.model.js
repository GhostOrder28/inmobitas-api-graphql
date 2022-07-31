const { UNIQUE_VIOLATION } = require('pg-error-constants');

const { strParseIn } = require('../utils/utility-functions');

async function signup (knex, signupData, t) {

  const {
    names,
    email,
    contactPhone,
    password,
    hashedPwd,
  } = signupData;

    try {
      const newUser = await knex.insert({
        names: strParseIn(names), // TODO: this should be username
        email,
        contact_phone: contactPhone,
        password: hashedPwd
      })
      .into('users')
      .returning('*')

      console.log('newUser: ', newUser);
      
      return { email, password }

    } catch (err) {
      if (err.code === UNIQUE_VIOLATION && err.constraint === 'agents_email_key') {
        throw new Error(t('emailAlreadyExists'));
      }
      throw new Error(`We couldn't register the user, reason: ${err}`)
    }
}

module.exports = {
  signup
}
