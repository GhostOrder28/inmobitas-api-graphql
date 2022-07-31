const { strParseIn, strParseOut } = require('../utils/utility-functions');

async function getAllListings (knex, params) {
  try {
    const { userid, clientid } = params;

    const listings = await knex('estates')
      .join('contracts', 'estates.estate_id', 'contracts.estate_id')
      .select('estates.estate_id', 'estates.client_id', 'district', 'neighborhood', 'contracts.estate_price', 'currency_type_id')
      .where('estates.user_id', '=', userid)
      .modify(function (queryBuilder) {
        if (clientid) {
          queryBuilder.andWhere('estates.client_id', '=', clientid);
        }
      })
      .returning('*')

    const formattedListings = listings.map(listing => ({
      clientId: listing.client_id,
      estateId: listing.estate_id,
      district: strParseOut(listing.district),
      neighborhood: strParseOut(listing.neighborhood),
    }));

    console.log('listings: ', formattedListings);

    return formattedListings;
      
  } catch (error) {
    throw new Error(error);
  }
}

async function getOneListing (knex, params) {
  try {
    const { userid, estateid } = params; 

    const contractsSq = knex.select('*')
      .from('contracts')
      .where('estate_id', '=', estateid)
      .as('c')

    const estatesSq = knex.select('*')
      .from('estates')
      .where('estate_id', '=', estateid)
      .as('e')

    const listing = await knex('clients')
      .join(estatesSq, 'clients.client_id', 'e.client_id')
      .join(contractsSq, 'clients.client_id', 'c.client_id')
      .leftJoin('features', 'e.estate_id', 'features.estate_id')
      .leftJoin('owner_preferences', 'e.estate_id', 'owner_preferences.estate_id')
      .where('clients.user_id', '=', userid)
      .andWhere('e.estate_id', '=', estateid)
      .select('*', 'e.estate_id', 'clients.client_id', 'c.contract_id') // WARNING: selection order is important, otherwise the retuned null values from the left joins would overwrite the previous ones which are correct
      .returning('*');

    const formattedListing = {
      clientId: listing[0].client_id,
      estateId: listing[0].estate_id,
      contractId: listing[0].contract_id,
      clientName: strParseOut(listing[0].name),
      clientContactPhone: Number(listing[0].contact_phone), // why this prop was being returned as string?
      contractTypeId: listing[0].contract_type_id,
      isExclusive: listing[0].is_exclusive,
      currencyTypeId: listing[0].currency_type_id,
      fee: listing[0].fee,
      isPercentage: listing[0].is_percentage,
      signedDate: listing[0].signed_date,
      startDate: listing[0].start_date,
      endDate: listing[0].end_date,
      estateTypeId: listing[0].estate_type_id,
      district: strParseOut(listing[0].district),
      neighborhood: strParseOut(listing[0].neighborhood),
      addressDetails: listing[0].address_details,
      estatePrice: listing[0].estate_price,
      floorLocation: listing[0].floor_location,
      numberOfFloors: listing[0].number_of_floors,
      totalArea: listing[0].total_area,
      builtArea: listing[0].built_area,
      estateDetails: listing[0].estate_details,
      numberOfBedrooms: listing[0].number_of_bedrooms,
      numberOfBathrooms: listing[0].number_of_bathrooms,
      numberOfGarages: listing[0].number_of_garages,
      numberOfKitchens: listing[0].number_of_kitchens,
      haveNaturalGas: listing[0].natural_gas,
      petsAllowed: listing[0].pets_allowed,
      childrenAllowed: listing[0].children_allowed,
      ownerPreferencesDetails: listing[0].owner_preferences_details,
      utilitiesIncluded: listing[0].utilities_included,
    }

    console.log('formattedListing: ', formattedListing);

    return formattedListing;
    
  } catch (error) {
    throw new Error(error);
  }
}

async function postListing (knex, params, listingData) {

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

  let formattedListing;

  const { userid, clientid, estateid, contractid } = params;

  if (contractTypeId === 1) clientType = 'seller';
  if (contractTypeId === 2) clientType = 'landlord';

  console.log('LOGGING data sent from frontend:');
  console.log(listingData);

    try {

      await knex.transaction(async trx => {

        const existingOwner = await trx.select('*')
          .from('clients')
          .where('user_id', '=', userid)
          .andWhere('name', '=', strParseIn(clientName))
          .returning('*')
        
        console.log('ownerExists: ', Boolean(existingOwner.length));
        console.log('owner: ', existingOwner);

        const clientData = existingOwner.length ? existingOwner : await trx.insert({
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

        formattedListing = {
          clientId: clientData[0].client_id,
          estateId: estateData[0].estate_id,
          contractId: contractData[0].contract_id,
          clientName: strParseOut(clientData[0].name),
          clientContactPhone: clientData[0].contact_phone,
          contractTypeId: contractData[0].contract_type_id,
          isExclusive: contractData[0].is_exclusive,
          currencyTypeId: contractData[0].currency_type_id,
          fee: contractData[0].fee,
          isPercentage: contractData[0].is_percentage,
          signedDate: contractData[0].signed_date,
          startDate: contractData[0].start_date,
          endDate: contractData[0].end_date,
          estateTypeId: estateData[0].estate_type_id,
          district: strParseOut(estateData[0].district),
          neighborhood: strParseOut(estateData[0].neighborhood),
          addressDetails: estateData[0].address_details,
          estatePrice: contractData[0].estate_price,
          floorLocation: estateData[0].floor_location,
          numberOfFloors: estateData[0].number_of_floors,
          totalArea: estateData[0].total_area,
          builtArea: estateData[0].built_area,
          estateDetails: estateData[0].estate_details,
          numberOfBedrooms: featuresData[0].number_of_bedrooms,
          numberOfBathrooms: featuresData[0].number_of_bathrooms,
          numberOfGarages: featuresData[0].number_of_garages,
          numberOfKitchens: featuresData[0].number_of_kitchens,
          haveNaturalGas: featuresData[0].natural_gas,
          petsAllowed: preferencesData && preferencesData[0].pets_allowed,
          childrenAllowed: preferencesData && preferencesData[0].children_allowed,
          ownerPreferencesDetails: preferencesData && preferencesData[0].owner_preferences_details,
          utilitiesIncluded: contractData[0].utilities_included,
        }

        console.log('formattedListing: ', formattedListing);
      });
      
      return formattedListing; 

    } catch (err) {
      console.log('Error code: ', err.code);
      console.log(err);
      // throw new Error(`There was an error: ${err}`)
    }

};

module.exports = {
  getAllListings,
  getOneListing,
  postListing
}
