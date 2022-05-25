const fs = require('fs-extra');
const { strParseIn, strParseOut } = require('../utils/utility-functions');
const Joi = require('joi');

const listingHandler = knex => (req, res) => {

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
  } = req.body;

  const { userid, clientid, estateid, contractid } = req.params;

  const validationSchema = Joi.object({
    clientName: Joi.string().pattern(/^[a-zA-Z\s]+$/).required()
    .messages({ 'string.pattern.base': req.t('lettersAndSpacesOnlyAllowed') }),
    clientContactPhone: Joi.number().required()
    .messages({ 'any.required': req.t('clientContactPhoneRequired') }),
    district: Joi.string().pattern(/^[a-zA-Z\s]+$/).required()
    .messages({
      'string.pattern.base': req.t('lettersAndSpacesOnlyAllowed'),
      'any.required': req.t('districtRequired') 
    }),
    neighborhood: Joi.string().pattern(/^[a-zA-Z\s]+$/).allow(null)
    .messages({ 'string.pattern.base': req.t('lettersAndSpacesOnlyAllowed') }),
    addressDetails: Joi.string().pattern(/^[a-zA-Z0-9\.\:\;\,\s]+$/).allow(null)
    .messages({ 'string.pattern.base': req.t('lettersSpacesAndSpecialCharactersOnlyAllowed') }),
    contractTypeId: Joi.number().required(),
    currencyTypeId: Joi.number().required(),
    client_type: contractTypeId === 1 ? 'seller' : 'landlord',
    estatePrice: Joi.number().allow(null),
    estateTypeId: Joi.number().required(),
    floorLocation: Joi.number().allow(null),
    numberOfFloors: Joi.number().allow(null),
    totalArea: Joi.number().allow(null),
    builtArea: Joi.number().allow(null),
    numberOfBedrooms: Joi.number().allow(null),
    numberOfBathrooms: Joi.number().allow(null),
    numberOfGarages: Joi.number().allow(null),
    numberOfKitchens: Joi.number().allow(null),
    estateDetails: Joi.string().pattern(/^[a-zA-Z0-9\.\:\;\,\s]+$/).allow(null)
    .messages({ 'string.pattern.base': req.t('lettersSpacesAndSpecialCharactersOnlyAllowed') }),
    fee: Joi.number().allow(null),
    signedDate: Joi.date().allow(null),
    startDate: Joi.date().allow(null),
    endDate: Joi.date().allow(null),
    ownerPreferencesDetails: Joi.string().pattern(/^[a-zA-Z0-9\.\:\;\,\s]+$/).allow(null)
    .messages({ 'string.pattern.base': req.t('lettersSpacesAndSpecialCharactersOnlyAllowed') }),
  });

  const { error, value } = validationSchema.validate({
    clientName,
    clientContactPhone,
    district,
    neighborhood,
    addressDetails,
    floorLocation,
    numberOfFloors,
    totalArea,
    builtArea,
    numberOfBedrooms,
    numberOfBathrooms,
    numberOfGarages,
    numberOfKitchens,
    estateDetails,
    signedDate,
    startDate,
    endDate,
    contractTypeId,
    currencyTypeId,
    estatePrice,
    estateTypeId,
    fee,
    ownerPreferencesDetails,
  }, { abortEarly: false })
  console.log('joi errors: ', error);

  if (error) return res.status(400).json({ validationErrors: error.details })

  let clientType = null;

  if (contractTypeId === 1) clientType = 'seller';
  if (contractTypeId === 2) clientType = 'landlord';

  console.log('LOGGING data sent from frontend:');
  console.log(req.body);

  (async function () {
    try {
      await knex.transaction(async trx => {

        const clientData = await trx.insert({
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

        const dbPayload = {
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

        console.log('dbPayload: ', dbPayload);

        res.status(200).json(dbPayload)

        // if (estateid) {
        //   res.status(200).json(`listing with estate_id ${estateid} has been updated!`)
        // } else {
        //   res.status(200).json(`listing with estate_id ${estateData[0].estate_id} has been added!`)
        // }

      })

    } catch (err) {
      console.log('Error code: ', err.code);
      console.log(err);
      // throw new Error(`There was an error: ${err}`)
    }


  })()

};

module.exports = {
  listingHandler
}
