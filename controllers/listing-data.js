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

      console.log('listingData: ', listingData);

      const dbPayload = {
        clientId: listingData[0].client_id,
        estateId: listingData[0].estate_id,
        contractId: listingData[0].contract_id,
        clientName: strParseOut(listingData[0].name),
        clientContactPhone: Number(listingData[0].contact_phone), // why this prop was being returned as string?
        contractTypeId: listingData[0].contract_type_id,
        isExclusive: listingData[0].is_exclusive,
        currencyTypeId: listingData[0].currency_type_id,
        fee: listingData[0].fee,
        isPercentage: listingData[0].is_percentage,
        signedDate: listingData[0].signed_date,
        startDate: listingData[0].start_date,
        endDate: listingData[0].end_date,
        estateTypeId: listingData[0].estate_type_id,
        district: strParseOut(listingData[0].district),
        neighborhood: strParseOut(listingData[0].neighborhood),
        addressDetails: listingData[0].address_details,
        estatePrice: listingData[0].estate_price,
        floorLocation: listingData[0].floor_location,
        numberOfFloors: listingData[0].number_of_floors,
        totalArea: listingData[0].total_area,
        builtArea: listingData[0].built_area,
        estateDetails: listingData[0].estate_details,
        numberOfBedrooms: listingData[0].number_of_bedrooms,
        numberOfBathrooms: listingData[0].number_of_bathrooms,
        numberOfGarages: listingData[0].number_of_garages,
        numberOfKitchens: listingData[0].number_of_kitchens,
        haveNaturalGas: listingData[0].natural_gas,
        petsAllowed: listingData[0].pets_allowed,
        childrenAllowed: listingData[0].children_allowed,
        ownerPreferencesDetails: listingData[0].owner_preferences_details,
        utilitiesIncluded: listingData[0].utilities_included,
      }

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
