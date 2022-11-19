const { getAllUsers } = require('../../models/users.model');
const { knexMain } = require('../../knex/knex-config');

module.exports = {
  Query: {
    users: async () => await getAllUsers(knexMain)
  }
}
