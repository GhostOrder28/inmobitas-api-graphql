const fs = require('fs-extra');
const { strParseIn } = require('../utils/utility-functions');

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

      const currencies = await knex.select('*')
      .from('currencies')
      .returning('*')

      // console.log('--------------- LOGGING: currencies');
      // console.log(currencies);

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
        district: listing.district && listing.district,
        neighborhood: listing.neighborhood && listing.neighborhood,
        // addressDetails: listing.address_details && listing.address_details,
        // contractType: contractTypes.find(contract => contract.contract_type_id === listing.contract_type_id).contract_name,
        // utilitiesIncluded: listing.utilities_included,
        // estateType: estateTypes.find(estate => estate.estate_type_id === listing.estate_type_id).estate_name,
        currencySymbol: currencies.find(currency => currency.currency_id === listing.currency_id).currency_symbol,
        estatePrice: listing.estate_price,
        // fee: listing.fee,
        // floorLocation: listing.floor_location && listing.floor_location,
        // numberOfFloors: listing.number_of_floors && listing.number_of_floors,
        // totalArea: listing.total_area && listing.total_area,
        // builtArea: listing.built_area && listing.built_area,
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
