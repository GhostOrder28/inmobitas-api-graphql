const knex = require('./knex-config');

const validateUserId = (userId) => {
  knex.select('*')
    .from('users')
    .where('user_id', '=', userId)
    .asCallback((err, rows) => {
      if (!rows.length) {
        throw Error("user doesn't exists, make sure you are logged in");
      }
    })
}

const validateEstateId = async (estateId) => {
  const estate = await knex.select('estate_id')
    .from('estates')
    .where('estate_id', '=', estateId);
  console.log(estate.length)
  return Boolean(estate.length);
}

module.exports = {
  validateUserId,
  validateEstateId
}
