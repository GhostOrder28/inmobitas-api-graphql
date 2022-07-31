const { strParseOut } = require('../utils/utility-functions');

async function getListingPresets (knex, clientLang) {
  try {

    const estateTypes = await knex.select('*')
    .from('estate_types')
    .returning('*');

    console.log('estateTypes: ', estateTypes);

    const contractTypes = await knex.select('*')
    .from('contract_types')
    .returning('*');

    console.log('contractTypes: ', contractTypes);

    const currencyTypes = await knex.select('*')
    .from('currency_types')
    .returning('*');

    console.log('currencyTypes: ', currencyTypes);

    const formattedListingPresets = {
      estateTypes: estateTypes.map(estate => ({
        estateTypeId: estate.estate_type_id,
        estateName: clientLang.includes('es') ? strParseOut(estate.estate_name_es) : strParseOut(estate.estate_name),
      })),
      contractTypes: contractTypes.map(contract => ({
        contractTypeId: contract.contract_type_id,
        contractName: clientLang.includes('es') ? strParseOut(contract.contract_name_es) : strParseOut(contract.contract_name)
      })),
      currencyTypes: currencyTypes.map(currency => ({
        currencyTypeId: currency.currency_type_id,
        currencyName: clientLang.includes('es') ? strParseOut(currency.currency_name_es) : strParseOut(currency.currency_name),
        currencySymbol: currency.currency_symbol,
      }))
    };

    console.log('formattedListingPresets: ', formattedListingPresets);

    return formattedListingPresets;
  } catch (err) {
    throw new Error(err)
  }
}

module.exports = {
  getListingPresets
}
