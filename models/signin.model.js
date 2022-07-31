const { strParseIn } = require('../utils/utility-functions');

async function signin (knex, userEmail) {

  try {
    const userData = await knex.select('user_id', 'email', 'password', 'names')
    .from('users')
    .where('email', '=', strParseIn(userEmail))
    .returning('*')

    return userData;
  } catch (err) {
    throw new Error(error);
  }
}

module.exports = {
  signin
}
