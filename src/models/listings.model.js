const { strParseIn, strParseOut } = require('../utils/utility-functions');
const { getListingPresets } = require('./listing-presets.model');

async function getListings (knex, entity) {
  try {
    const { userId, clientId, estateId } = entity;

    const listings = await knex('clients as c')
      .innerJoin('estates as e', 'c.client_id', 'e.client_id')
      .innerJoin('contracts as co', 'e.estate_id', 'co.estate_id')
      .leftJoin('features as f', 'e.estate_id', 'f.estate_id')
      .leftJoin('owner_preferences as op', 'e.estate_id', 'op.estate_id')
      .modify(function (queryBuilder) {
        if (clientId) {
          queryBuilder.where('c.client_id', '=', clientId);
        } else if (estateId) {
          queryBuilder.where('e.estate_id', '=', estateId);
        } else {
          queryBuilder.where('c.user_id', '=', userId);
        }
      })
      .select(
        // owner
        'c.name',
        'c.contact_phone',
        // location
        'e.district',
        'e.neighborhood',
        'e.address_details',
        // estate
        'e.estate_type_id',
        'e.floor_location',
        'e.number_of_floors',
        'e.total_area',
        'e.built_area',
        'e.estate_details',
        // features
        'f.number_of_bedrooms',
        'f.number_of_bathrooms',
        'f.number_of_garages',
        'f.number_of_kitchens',
        'f.natural_gas',
        // contract
        'co.contract_type_id',
        'co.is_exclusive',
        // owner preferences
        'op.pets_allowed',
        'op.children_allowed',
        'op.owner_preferences_details',
        // ids
        'c.client_id',
        'e.estate_id',
        'co.contract_id'
      )
      .returning('*');

			const payload = listings.map(listing => {
        return {
          clientId: listing.client_id,
          estateId: listing.estate_id,
          contractId: listing.contract_id,
          clientName: strParseOut(listing.name),
          clientContactPhone: Number(listing.contact_phone), 
          contractTypeId: listing.contract_type_id,
          isExclusive: listing.is_exclusive,
          estateTypeId: listing.estate_type_id,
          district: strParseOut(listing.district),
          neighborhood: strParseOut(listing.neighborhood),
          addressDetails: listing.address_details,
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
        }
			})

    return estateId ? payload[0] : payload
  } catch(err) {
    console.error(err)
  }

}

async function postListing (knex, params, listingData, t, clientLang) {

  const {
    clientName,
    clientContactPhone,
    district,
    neighborhood,
    addressDetails,
    contractTypeId,
    petsAllowed,
    childrenAllowed,
    estateTypeId,
    estatePrice,
    floorLocation,
    numberOfFloors,
    totalArea,
    builtArea,
    numberOfBedrooms,
    numberOfBathrooms,
    numberOfGarages,
    numberOfKitchens,
    haveNaturalGas,
    estateDetails,
    fee,
    signedDate,
    startDate,
    endDate,
    currencyTypeId,
    isExclusive,
    isPercentage,
    ownerPreferencesDetails,
    utilitiesIncluded,
  } = listingData;

  let groupedListing;

  const { userid, clientid, estateid, contractid } = params;

  if (contractTypeId === 1) clientType = 'seller';
  if (contractTypeId === 2) clientType = 'landlord';

  console.log('LOGGING data sent from frontend:');
  console.log(listingData);

    try {

      await knex.transaction(async trx => {

        const existingClient = await trx.select('*')
          .from('clients')
          .where('user_id', '=', userid)
          .andWhere('name', '=', strParseIn(clientName))
          .returning('*')
        
        console.log('clientExists: ', Boolean(existingClient.length));
        console.log('client``: ', existingClient);

        const clientData = existingClient.length ? existingClient : await trx.insert({
          ... clientid ? { client_id: clientid } : {},
          user_id: userid,
          name: strParseIn(clientName),
          client_type: contractTypeId === 1 ? 'seller' : 'landlord',
          contact_phone: clientContactPhone,
        })
        .into('clients')
        .onConflict('client_id')
        .merge()
        .returning('*')
        .catch(err => {throw new Error (`Error trying to insert into clients: ${err}`)})

        console.log('clientData:', clientData);

        const estateData = await trx.insert({
          ... estateid ? { estate_id: estateid } : {},
          client_id: clientData[0].client_id,
          user_id: userid,
          district: strParseIn(district),
          neighborhood: strParseIn(neighborhood),
          address_details: addressDetails,
          estate_type_id: estateTypeId,
          floor_location: estateTypeId !== 1 ? floorLocation : null,
          number_of_floors: estateTypeId === 1 ? numberOfFloors : null,
          total_area: totalArea,
          built_area: builtArea,
          estate_details: estateDetails,
        })
        .into('estates')
        .onConflict('estate_id')
        .merge()
        .returning('*')
        .catch(err => {throw new Error (`Error trying to insert into estates: ${err}`)})

        console.log('estateData:', estateData);

        const contractData = await trx.insert({
          ... contractid ? { contract_id: contractid } : {},
          user_id: userid,
          client_id: clientData[0].client_id,
          estate_id: estateData[0].estate_id,
          contract_type_id: contractTypeId,
          is_exclusive: isExclusive,
          currency_type_id: currencyTypeId,
          estate_price: estatePrice,
          fee: fee,
          is_percentage: isPercentage,
          signed_date: signedDate,
          start_date: startDate,
          end_date: endDate,
          utilities_included: contractTypeId === 2 ? utilitiesIncluded : null,
        })
        .into('contracts')
        .onConflict('contract_id')
        .merge()
        .returning('*')
        .catch(err => {throw new Error (`Error trying to insert into contracts: ${err}`)}) 

        console.log('contractData:', contractData);

        const featuresData = await trx.insert({
          estate_id: estateData[0].estate_id,
          number_of_bedrooms: numberOfBedrooms,
          number_of_bathrooms: numberOfBathrooms,
          number_of_garages: numberOfGarages,
          number_of_kitchens: numberOfKitchens,
          natural_gas: haveNaturalGas,
        })
        .into('features')
        .onConflict('estate_id')
        .merge()
        .returning('*')
        .catch(err => {throw new Error (`Error trying to insert into features: ${err}`)})

        console.log('featuresData:', featuresData);

        let preferencesData = null;
        if (contractTypeId === 2) { // if contractTypeId is 'rental'
          const data = await trx.insert({
            estate_id: estateData[0].estate_id,
            pets_allowed: petsAllowed,
            children_allowed: childrenAllowed,
            owner_preferences_details: ownerPreferencesDetails,
          })
          .onConflict('estate_id')
          .merge()
          .into('owner_preferences')
          .returning('*')
          .catch(err => {throw new Error (`Error trying to insert into owner_preferences: ${err}`)})

          preferencesData = data
          console.log('preferencesData:', preferencesData);
        }

        if (contractTypeId === 1) { // if contract has been change from rental to sale, delete the preferences if there were any
          const selectPreferencesData = await trx.select('estate_id')
          .from('owner_preferences')
          .where('estate_id', '=', estateData[0].estate_id)
          .returning('*')
          .catch(err => {throw new Error (`Error trying to select owner_preferences: ${err}`)})


          console.log('selectPreferencesData:', selectPreferencesData);

          if (selectPreferencesData.length) {
            const deletedPreferences = await trx('owner_preferences')
            .where('estate_id', estateData[0].estate_id)
            .del()
            .catch(err => {throw new Error (`Error trying to delete from owner_preferences: ${err}`)})

            console.log('deletedPreferences:', deletedPreferences);
          }
        }

        const listingData = {
          ...clientData[0], 
          ...contractData[0], 
          ...estateData[0], 
          ...featuresData[0], 
          ...(preferencesData !== null ? preferencesData[0] : {})
        }

        const listingPresets = await getListingPresets(knex, clientLang);
        groupedListing = getGroupedListingData(listingData, listingPresets, t);
        console.log('groupedListing: ', groupedListing);
      });
      
      return groupedListing;

    } catch (err) {
       throw new Error(`There was an error: ${err}`)
    }

};

async function deleteOneListing (knex, params) {
  const { userid, listingid } = params;

  try {
  const deletedListing = await knex('estates')
    .where('user_id', '=', userid)
    .andWhere('estate_id', '=', listingid)
    .del()
    .returning('*')

  console.log('deletedListing: ', deletedListing);

  return deletedListing[0].estate_id;

  } catch (error) {
    console.log(error)
    throw new Error({ error });
  }
}

module.exports = {
  postListing,
  deleteOneListing,
  getListings,
}
