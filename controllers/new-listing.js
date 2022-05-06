const fs = require('fs-extra');
const { strParseIn } = require('../utils/utility-functions');
const Joi = require('joi');

const newListingHandler = knex => (req, res) => {

  const {
    clientName,
    clientContactPhone,
    district,
    neighborhood,
    addressDetails,
    contractTypeId,
    petsAllowed,
    childrenAllowed,
    preferencesDetails,
    estateTypeId,
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
    userId,
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
    contractTypeId: Joi.number().required(),
    currency: Joi.number().required(),
    estatePrice: Joi.number(),
    estateTypeId: Joi.number().required(),
    preferencesDetails: Joi.string().alphanum(),
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
    ownerPreferencesDetails: Joi.string().pattern(/^[a-zA-Z\s]+$/)
    .messages({ 'string.pattern.base': 'invalid character, only letters and spaces are allowed' }),
  });

  const { error, value } = validationSchema.validate({
    clientName,
    clientContactPhone,
    district,
    neighborhood,
    addressDetails,
    preferencesDetails,
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
    contractTypeId,
    currency,
    estatePrice,
    estateTypeId,
    fee,
    ownerPreferencesDetails,
  }, { abortEarly: false })

  if (error) return res.status(400).json({ validationErrors: error.details })

  let clientType = null;

  if (contractTypeId === 1) clientType = 'seller';
  if (contractTypeId === 2) clientType = 'landlord';

  console.log('LOGGING data sent from frontend:');
  console.log(req.body);

  (async function () {
    try {
      await knex.transaction(async trx => {

        const newClient = await trx.insert({
          user_id: userId,
          name: strParseIn(clientName),
          client_type: contractTypeId === 1 ? 'seller' : 'landlord',
          contact_phone: clientContactPhone,
        })
        .into('clients')
        .returning('*')

        console.log('LOGGING newClient:');
        console.log(newClient);

        const newEstate = await trx.insert({
          client_id: newClient[0].client_id,
          user_id: userId,
          district,
          neighborhood,
          address_details: addressDetails,
          estate_type_id: estateTypeId,
          floor_location: floorLocation,
          number_of_floors: floors,
          total_area: totalArea,
          built_area: builtArea,
          estate_details: estateDetails,
        })
        .into('estates')
        .returning('*')

        console.log('LOGGING newEstate:');
        console.log(newEstate);

        const features = await trx.insert({
          estate_id: newEstate[0].estate_id,
          number_of_bedrooms: numberOfBedrooms,
          number_of_bathrooms: numberOfBathrooms,
          number_of_garages: numberOfGarages,
          number_of_kitchens: numberOfKitchens,
          natural_gas: haveNaturalGas,
        })
        .into('features')
        .returning('*')

        console.log('LOGGING features:');
        console.log(features);

        const newContract = await trx.insert({
          user_id: userId,
          client_id: newClient[0].client_id,
          estate_id: newEstate[0].estate_id,
          contract_type_id: contractTypeId,
          is_exclusive: isExclusive,
          currency_type_id: currency,
          estate_price: estatePrice,
          fee: fee,
          is_percentage: isPercentage,
          signed_date: signedDate,
          start_date: startDate,
          end_date: endDate,
          utilities_included: utilitiesIncluded,
        })
        .into('contracts')
        .returning('*')

        console.log('LOGGING newContract:');
        console.log(newContract);

        if (contractTypeId === 2) { // if contractTypeId is 'rental'
          const ownerPreferences = await trx.insert({
            estate_id: newEstate[0].estate_id,
            pets_allowed: petsAllowed,
            children_allowed: childrenAllowed,
            owner_preferences_details: ownerPreferencesDetails,
          })
          .into('owner_preferences')
          .returning('*')

          console.log('LOGGING ownerPreferences:');
          console.log(ownerPreferences);
        }

      })
    } catch (err) {
      throw new Error(`There was an error: ${err}`)
    }

    res.status(200).json('New listing added!')

  })()

};

module.exports = {
  newListingHandler
}
