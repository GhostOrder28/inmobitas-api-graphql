const { strParseIn, strParseOut } = require('../utils/utility-functions');
const { getListingPresets } = require('./listing-presets.model');

async function getGroupedListingData (listing, presets, t) {
  return [
    {
      header: t('owner'),
      items: [
        {
          label: t('name'),
          value: strParseOut(listing.name)
        },
        {
          label: t('phone'),
          value: Number(listing.contact_phone)
        }
      ]
    },
    {
      header: t('contract'),
      items: [
        {
          label: t('contractType'),
          value: presets.contractTypes.find(contractType => contractType.contractTypeId === listing.contract_type_id).contractName
        },
        {
          label: t('exclusive'),
          value: listing.is_exclusive ? t('yes') : t('no')
        }
      ]
    },
    ...(listing.contract_type_id === 2 ? [{
      header: t('ownerPreferences'),
      items: [
        {
          label: t('petsAllowed'),
          value: listing.pets_allowed ? t('yes') : t('no')
        },
        {
          label: t('childrenAllowed'),
          value: listing.children_allowed ? t('yes') : t('no')
        },
        {
          label: t('preferencesDetails'),
          value: listing.owner_preferences_details 
        }
      ]
    }] : []),
    {
      header: t('location'),
      items: [
        {
          label: t('district'),
          value: strParseOut(listing.district) 
        },
        {
          label: t('neighborhood'),
          value: strParseOut(listing.neighborhood) 
        },
        {
          label: t('addressDetails'),
          value: listing.address_details 
        }
      ]
    },
    {
      header: t('estate'),
      items: [
        {
          label: t('estateType'),
          value: presets.estateTypes.find(estateType => estateType.estateTypeId === listing.estate_type_id).estateName 
        },
        ...listing.estate_type_id !== 1 ? [{
          label: t('floorLocation'),
          value: listing.floor_location 
        }] : [],
        ...listing.contract_type_id === 1 ? [{
          label: t('numberOfFloors'),
          value: listing.number_of_floors 
        }] : [],
        {
          label: t('totalArea'),
          value: listing.total_area && `${listing.total_area} m²`
        },
        {
          label: t('builtArea'),
          value: listing.built_area && `${listing.built_area} m²`
        },
        {
          label: t('bedrooms'),
          value: listing.number_of_bedrooms 
        },
        {
          label: t('bathrooms'),
          value: listing.number_of_bathrooms 
        },
        {
          label: t('garages'),
          value: listing.number_of_garages 
        },
        {
          label: t('kitchens'),
          value: listing.number_of_kitchens 
        },
        {
          label: t('naturalGas'),
          value: listing.natural_gas ? t('yes') : t('no') 
        },
        {
          label: t('estateDetails'),
          value: listing.estate_details
        }
      ]
    }
  ]
}

async function getUngroupedListingData (listing) {
  return {
    clientId: listing.client_id,
    estateId: listing.estate_id,
    contractId: listing.contract_id,
    clientName: strParseOut(listing.name),
    clientContactPhone: Number(listing.contact_phone), // why this prop was being returned as string?
    contractTypeId: listing.contract_type_id,
    isExclusive: listing.is_exclusive,
    currencyTypeId: listing.currency_type_id,
    fee: listing.fee,
    isPercentage: listing.is_percentage,
    signedDate: listing.signed_date,
    startDate: listing.start_date,
    endDate: listing.end_date,
    estateTypeId: listing.estate_type_id,
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
  }
}

async function getAllListings (knex, params) {
  try {
    const { userid, clientid } = params;

    const listings = await knex('estates')
      .join('contracts', 'estates.estate_id', 'contracts.estate_id')
      .select('estates.estate_id', 'district', 'neighborhood', 'contracts.estate_price', 'currency_type_id', 'estates.total_area', 'estates.built_area')
      .where('estates.user_id', '=', userid)
      .modify(function (queryBuilder) {
        if (clientid) {
          queryBuilder.andWhere('estates.client_id', '=', clientid);
        }
      })
      .returning('*')

    const formattedListings = listings.map(listing => ({
      estateId: listing.estate_id,
      district: strParseOut(listing.district),
      neighborhood: strParseOut(listing.neighborhood),
      totalArea: listing.total_area,
      builtArea: listing.built_area
    }));

    console.log('listings: ', formattedListings);

    return formattedListings;
      
  } catch (error) {
    throw new Error(error);
  }
}

async function getOneListing (knex, params, t, clientLang) {
  try {
    const { userid, estateid, group } = params;
    console.log('is group?: ', group)

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

    if (group) {
      const listingPresets = await getListingPresets(knex, clientLang);
      const groupedListing = getGroupedListingData(listing[0], listingPresets, t);
      console.log('groupedListing: ', groupedListing);
      return groupedListing;
    } else {
      const ungroupListing = getUngroupedListingData(listing[0]);
      console.log('ungroupListing: ', ungroupListing);
      return ungroupListing;
    }
  } catch (error) {
    throw new Error(error);
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
  getAllListings,
  getOneListing,
  postListing,
  deleteOneListing,
}
