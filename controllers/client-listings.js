const fs = require('fs-extra');
const { strParseIn } = require('../utils/utility-functions');

const clientListingsHandler = knex => (req, res) => {

  const userId = req.params.userid;
  const clientId = req.params.clientid;

  (async function () {

    try {

      const clientListings = await knex('estates')
      .join('contracts', 'estates.client_id', 'contracts.client_id')
      .where('estates.user_id', '=', userId)
      .andWhere('estates.client_id', '=', clientId)
      .select('estates.estate_id', 'district', 'neighborhood', 'contracts.estate_price', 'currency_type_id')
      .returning('*');

      console.log('--------------- LOGGING: clientListings');
      console.log(clientListings);

      const currency_types = await knex.select('*')
      .from('currency_types')
      .returning('*')

      // console.log('--------------- LOGGING: currency_types');
      // console.log(currency_types);

      const dbPayload = clientListings.map(listing => ({
        estateId: listing.estate_id,
        district: listing.district,
        neighborhood: listing.neighborhood,
        estatePrice: listing.estate_price,
        currencySymbol: currency_types.find(currency => currency.currency_type_id === listing.currency_type_id).currency_symbol,
      }));

      // console.log('--------------- LOGGING: dbPayload');
      // console.log(dbPayload);

      res.status(200).json(dbPayload)

    } catch (err) {
      throw new Error(err)
    }

  })()

}

module.exports = {
  clientListingsHandler
}
