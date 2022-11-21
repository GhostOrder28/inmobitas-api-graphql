const { getOneListing, getListings } = require('../../models/listings.model');
const { knexMain } = require('../../knex/knex-config');

module.exports = {
  Query: {
    userListings: (_, args) => getListings(knexMain, { userId: args.userId }),
    clientListings: (_, args) => getListings(knexMain, { clientId: args.clientId}),
    listing: (_, args) => getListings(knexMain, { estateId: args.estateId }),
  }
}
