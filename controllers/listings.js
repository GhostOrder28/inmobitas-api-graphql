const fs = require('fs-extra');
const { strParseOut } = require('../utils/utility-functions');

const listingsHandler = knex => (req, res) => {

  const userId = req.params.userid;
  console.log(req.params);

  (async function () {

    try {

      const listingsData = await knex('estates')
      .join('contracts', 'estates.estate_id', 'contracts.estate_id')
      .leftJoin('features', 'estates.estate_id', 'features.estate_id')
      .select('*', 'estates.estate_id')
      .where('estates.user_id', '=', userId)
      .returning('*');

      // console.log('--------------- LOGGING: listingsData');
      // console.log(listingsData);

      const currency_types = await knex.select('*')
      .from('currency_types')
      .returning('*')

      // console.log('--------------- LOGGING: currency_types');
      // console.log(currency_types);

      const contractTypes = await knex.select('*')
      .from('contract_types')
      .returning('*')

      // console.log('--------------- LOGGING: contractTypes');
      // console.log(contractTypes);

      const estateTypes = await knex.select('*')
      .from('estate_types')
      .returning('*')

      // console.log('--------------- LOGGING: estateTypes');
      // console.log(estateTypes);

      const dbPayload = listingsData.map(listing => ({
        estateId: listing.estate_id,
        district: listing.district && strParseOut(listing.district),
        neighborhood: listing.neighborhood && strParseOut(listing.neighborhood),
        currencySymbol: currency_types.find(currency => currency.currency_type_id === listing.currency_type_id).currency_symbol,
        estatePrice: listing.estate_price,
      }))

      console.log('--------------- LOGGING: dbPayload');
      console.log(dbPayload);

      res.status(200).json(dbPayload)
    } catch (err) {
      throw new Error(err)
    }

  })()

}

module.exports = {
  listingsHandler
}
