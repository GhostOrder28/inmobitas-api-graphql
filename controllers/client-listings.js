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
      .select('estates.estate_id', 'district', 'neighborhood', 'contracts.estate_price', 'currency_id')
      .returning('*');

      console.log('--------------- LOGGING: clientListings');
      console.log(clientListings);

      const currencies = await knex.select('*')
      .from('currencies')
      .returning('*')

      // console.log('--------------- LOGGING: currencies');
      // console.log(currencies);

      const dbPayload = clientListings.map(listing => ({
        estateId: listing.estate_id,
        district: listing.district,
        neighborhood: listing.neighborhood,
        estatePrice: listing.estate_price,
        currencySymbol: currencies.find(currency => currency.currency_id === listing.currency_id).currency_symbol,
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
