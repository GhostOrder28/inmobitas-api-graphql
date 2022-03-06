const fs = require('fs-extra');
const { strParseIn } = require('../utils/utility-functions');
const Joi = require('joi');

const listingHandler = knex => (req, res) => {

  const {
    clientName,
    clientContactPhone,
    district,
    neighborhood,
    addressDetails,
    contractType,
    petsAllowed,
    childrenAllowed,
    estateType,
    estatePrice,
    floorLocation,
    floors,
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
    currency,
    isExclusive,
    isPercentage,
    ownerPreferencesDetails,
    utilitiesIncluded,
  } = req.body;

  const { userid, clientid, estateid, contractid } = req.params;

  const validationSchema = Joi.object({
    clientName: Joi.string().pattern(/^[a-zA-Z\s]+$/).required()
    .messages({ 'string.pattern.base': 'invalid character, only letters and spaces are allowed' }),
    clientContactPhone: Joi.number().required(),
    district: Joi.string().pattern(/^[a-zA-Z\s]+$/).required()
    .messages({ 'string.pattern.base': 'invalid character, only letters and spaces are allowed' }),
    neighborhood: Joi.string().pattern(/^[a-zA-Z\s]+$/)
    .messages({ 'string.pattern.base': 'invalid character, only letters and spaces are allowed' }),
    addressDetails: Joi.string().pattern(/^[a-zA-Z0-9\.\:\;\,\s]+$/)
    .messages({ 'string.pattern.base': 'invalid character, only letters, spaces and .,:; special characters are allowed' }),
    contractType: Joi.number().required(),
    currency: Joi.number().required(),client_type: contractType === 1 ? 'seller' : 'landlord',
    estatePrice: Joi.number(),
    estateType: Joi.number().required(),
    floorLocation: Joi.number(),
    floors: Joi.number(),
    totalArea: Joi.number(),
    builtArea: Joi.number(),
    numberOfBedrooms: Joi.number(),
    numberOfBathrooms: Joi.number(),
    numberOfGarages: Joi.number(),
    numberOfKitchens: Joi.number(),
    estateDetails: Joi.string().pattern(/^[a-zA-Z0-9\.\:\;\,\s]+$/)
    .messages({ 'string.pattern.base': 'invalid character, only letters, spaces and .,:; special characters are allowed' }),
    fee: Joi.number(),
    signedDate: Joi.date(),
    startDate: Joi.date(),
    endDate: Joi.date(),
    ownerPreferencesDetails: Joi.string().pattern(/^[a-zA-Z0-9\.\:\;\,\s]+$/)
    .messages({ 'string.pattern.base': 'invalid character, only letters, spaces and .,:; special characters are allowed' }),
  });

  const { error, value } = validationSchema.validate({
    clientName,
    clientContactPhone,
    district,
    neighborhood,
    addressDetails,
    floorLocation,
    floors,
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
    contractType,
    currency,
    estatePrice,
    estateType,
    fee,
    ownerPreferencesDetails,
  }, { abortEarly: false })

  if (error) return res.status(400).json({ validationErrors: error.details })

  let clientType = null;

  if (contractType === 1) clientType = 'seller';
  if (contractType === 2) clientType = 'landlord';

  console.log('LOGGING data sent from frontend:');
  console.log(req.body);

  (async function () {
    try {
      await knex.transaction(async trx => {

        const clientData = await trx.insert({
          ... clientid ? { client_id: clientid } : {},
          user_id: userid,
          name: strParseIn(clientName),
          client_type: contractType === 1 ? 'seller' : 'landlord',
          contact_phone: clientContactPhone,
        })
        .into('clients')
        .onConflict('client_id')
        .merge()
        .returning('*')

        console.log('clientData:', clientData);

        const estateData = await trx.insert({
          ... estateid ? { estate_id: estateid } : {},
          client_id: clientData[0].client_id,
          user_id: userid,
          district: strParseIn(district),
          neighborhood: strParseIn(neighborhood),
          address_details: addressDetails,
          estate_type_id: estateType,
          floor_location: estateType !== 1 ? floorLocation : null,
          number_of_floors: estateType === 1 ? floors : null,
          total_area: totalArea,
          built_area: builtArea,
          estate_details: estateDetails,
        })
        .into('estates')
        .onConflict('estate_id')
        .merge()
        .returning('*')

        console.log('estateData:', estateData);

        const contractData = await trx.insert({
          ... contractid ? { contract_id: contractid } : {},
          user_id: userid,
          client_id: clientData[0].client_id,
          estate_id: estateData[0].estate_id,
          contract_type_id: contractType,
          is_exclusive: isExclusive,
          currency_id: currency,
          estate_price: estatePrice,
          fee: fee,
          is_percentage: isPercentage,
          signed_date: signedDate,
          start_date: startDate,
          end_date: endDate,
          utilities_included: contractType === 2 ? utilitiesIncluded : null,
        })
        .into('contracts')
        .onConflict('contract_id')
        .merge()
        .returning('*')

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

        console.log('featuresData:', featuresData);

        if (contractType === 2) { // if contractType is 'rental'
          const preferencesData = await trx.insert({
            estate_id: estateData[0].estate_id,
            pets_allowed: petsAllowed,
            children_allowed: childrenAllowed,
            owner_preferences_details: ownerPreferencesDetails,
          })
          .onConflict('estate_id')
          .merge()
          .into('owner_preferences')
          .returning('*')

          console.log('preferencesData:', preferencesData);
        }

        if (contractType === 1) { // if contract has been change from rental to sale, delete the preferences if there were any
          const selectPreferencesData = await trx.select('estate_id')
          .from('owner_preferences')
          .where('estate_id', '=', estateData[0].estate_id)
          .returning('*')

          console.log('selectPreferencesData:', selectPreferencesData);

          if (selectPreferencesData.length) {
            const deletedPreferences = await trx('owner_preferences')
            .where('estate_id', estateData[0].estate_id)
            .del()

            console.log('deletedPreferences:', deletedPreferences);
          }
        }

      })
    } catch (err) {
      console.log(err.code);
      throw new Error(`There was an error: ${err}`)
    }

    res.status(200).json(`listing(estate really) with id ${estateid} has been updated!`) // TODO: why is this not printing in the frontend?

  })()

};

module.exports = {
  listingHandler
}
