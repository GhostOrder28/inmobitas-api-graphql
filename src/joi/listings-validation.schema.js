const Joi = require('joi');

function listingValidationSchema (t, contractTypeId) {
  console.log('t: ', t())
  return Joi.object({
    clientName: Joi.string().pattern(/^[a-zA-ZñÑáéíóúüÁÉÍÓÚ\s]+$/i).required()
    .messages({
      'string.pattern.base': t('lettersAndSpacesOnlyAllowed'),
      'any.required': t('clientNameRequired')
    }),
    clientContactPhone: Joi.number().required()
    .messages({ 'any.required': t('clientContactPhoneRequired') }),
    district: Joi.string().pattern(/^[a-zA-ZñÑáéíóúüÁÉÍÓÚ\s]+$/i).required() 
    .messages({
      'string.pattern.base': t('lettersAndSpacesOnlyAllowed'),
      'any.required': t('districtRequired') 
    }),
    neighborhood: Joi.string().pattern(/^[0-9a-zA-ZñÑáéíóúüÁÉÍÓÚ\s]+$/i).allow(null)
    .messages({ 'string.pattern.base': t('lettersAndSpacesOnlyAllowed') }),
    addressDetails: Joi.string().pattern(/^[0-9a-zA-ZñÑáéíóúüÁÉÍÓÚ\.\:\;\,\s]+$/).allow(null)
    .messages({ 'string.pattern.base': t('lettersSpacesAndSpecialCharactersOnlyAllowed') }),
    contractTypeId: Joi.number().required(),
    //currencyTypeId: Joi.number().required(),
    client_type: contractTypeId === 1 ? 'seller' : 'landlord',
    //estatePrice: Joi.number().allow(null),
    estateTypeId: Joi.number().required(),
    floorLocation: Joi.number().allow(null),
    numberOfFloors: Joi.number().allow(null),
    totalArea: Joi.number().allow(null),
    builtArea: Joi.number().allow(null),
    numberOfBedrooms: Joi.number().allow(null),
    numberOfBathrooms: Joi.number().allow(null),
    numberOfGarages: Joi.number().allow(null),
    numberOfKitchens: Joi.number().allow(null),
    estateDetails: Joi.string().pattern(/^[0-9a-zA-ZñÑáéíóúüÁÉÍÓÚ\.\:\;\,\s]+$/).allow(null)
    .messages({ 'string.pattern.base': t('lettersSpacesAndSpecialCharactersOnlyAllowed') }),
    //fee: Joi.number().allow(null),
    //signedDate: Joi.date().allow(null),
    //startDate: Joi.date().allow(null),
    //endDate: Joi.date().allow(null),
    ownerPreferencesDetails: Joi.string().pattern(/^[0-9a-zA-ZñÑáéíóúüÁÉÍÓÚ\.\:\;\,\s]+$/).allow(null)
    .messages({ 'string.pattern.base': t('lettersSpacesAndSpecialCharactersOnlyAllowed') }),
    //isPercentage: Joi.boolean().allow(null),
    isExclusive: Joi.boolean().allow(null),
    haveNaturalGas: Joi.boolean().allow(null),
    petsAllowed: Joi.boolean().allow(null),
    childrenAllowed: Joi.boolean().allow(null),
    //utilitiesIncluded: Joi.boolean().allow(null),
  });
}

module.exports = {
  listingValidationSchema,
}
