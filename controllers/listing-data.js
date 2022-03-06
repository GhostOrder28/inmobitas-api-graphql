const fs = require('fs-extra');
const { strParseIn, strParseOut } = require('../utils/utility-functions');

const listingDataHandler = knex => (req, res) => {

  const { userid, estateid } = req.params;
  console.log(`userid ${userid}`, `estateid ${estateid}`);

  (async function () {

    try {

      const listingData = await knex('clients')
      .join('estates', 'clients.client_id', 'estates.client_id')
      .join('contracts', 'clients.client_id', 'contracts.client_id')
      .leftJoin('features', 'estates.estate_id', 'features.estate_id')
      .leftJoin('owner_preferences', 'estates.estate_id', 'owner_preferences.estate_id')
      .select('*', 'estates.estate_id', 'clients.client_id', 'contracts.contract_id') // WARNING: selection order is important, otherwise the retuned null values from the left joins would overwrite the previous ones which are correct
      .where('clients.user_id', '=', userid)
      .andWhere('estates.estate_id', '=', estateid)
      .returning('*');

      console.log('--------------- LOGGING: listingData');
      console.log(listingData);

      const dbPayload = listingData.map(listing => ({
        clientId: listing.client_id,
        estateId: listing.estate_id,
        contractId: listing.contract_id,
        clientName: strParseOut(listing.name),
        clientContactPhone: listing.contact_phone,
        contractType: listing.contract_type_id,
        isExclusive: listing.is_exclusive,
        currency: listing.currency_id,
        fee: listing.fee,
        isPercentage: listing.is_percentage,
        signedDate: listing.signed_date,
        startDate: listing.start_date,
        endDate: listing.end_date,
        estateType: listing.estate_type_id,
        district: strParseOut(listing.district),
        neighborhood: strParseOut(listing.neighborhood),
        addressDetails: listing.address_details,
        estatePrice: listing.estate_price,
        floorLocation: listing.floor_location,
        numberOfFloors: listing.number_of_floors,
        totalArea: listing.total_area,
        builtArea: listing.built_area,
        estateDetails: listing.estate_details,
        numberOfBedrooms: listing.number_of_bedrooms,
        numberOfBathrooms: listing.number_of_bathrooms,
        numberOfGarages: listing.number_of_garages,
        numberOfKitchens: listing.number_of_kitchens,
        haveNaturalGas: listing.natural_gas,
        petsAllowed: listing.pets_allowed,
        childrenAllowed: listing.children_allowed,
        ownerPreferencesDetails: listing.owner_preferences_details,
        utilitiesIncluded: listing.utilities_included,
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
  listingDataHandler
}
