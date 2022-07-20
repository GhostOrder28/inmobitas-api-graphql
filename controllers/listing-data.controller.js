const fs = require('fs-extra');
const { strParseIn, strParseOut } = require('../utils/utility-functions');
const {
  validateEstateId
} = require('../knex/knex-validators');

const getListing = knex => async (req, res) => {

  const { userid, estateid } = req.params;

  const estateExists = await validateEstateId(estateid)
  if (!estateExists) {
    return res.status(400).json({ error: "the estate doesn't exists, make sure you are on a listing page" }) 
  } 

  (async function () {

    try {

      const contractsSq = knex.select('*')
        .from('contracts')
        .where('estate_id', '=', estateid)
        .as('c')

      const estatesSq = knex.select('*')
        .from('estates')
        .where('estate_id', '=', estateid)
        .as('e')

      const listingData = await knex('clients')
        .join(estatesSq, 'clients.client_id', 'e.client_id')
        .join(contractsSq, 'clients.client_id', 'c.client_id')
        .leftJoin('features', 'e.estate_id', 'features.estate_id')
        .leftJoin('owner_preferences', 'e.estate_id', 'owner_preferences.estate_id')
        .where('clients.user_id', '=', userid)
        .andWhere('e.estate_id', '=', estateid)
        .select('*', 'e.estate_id', 'clients.client_id', 'c.contract_id') // WARNING: selection order is important, otherwise the retuned null values from the left joins would overwrite the previous ones which are correct
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
      return res.status(400).json({ error: err.message });
    }

  })()

}

module.exports = {
  getListing
}
