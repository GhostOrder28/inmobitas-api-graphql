const { getAllClients } = require('../../models/clients.model');
const { knexMain } = require('../../knex/knex-config');

module.exports = {
  Query: {
    clients: (_, args) => getAllClients(knexMain, args.userId) 
  }
}
