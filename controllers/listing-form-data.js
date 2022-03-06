const { strParseOut } = require('../utils/utility-functions');

const listingFormDataHandler = knex => (req, res) => {

  (async function () {

    try {

      const estateTypes = await knex.select('*')
      .from('estate_types')
      .returning('*');

      console.log('--------------- LOGGING: estateTypes');
      console.log(estateTypes);

      const contractTypes = await knex.select('*')
      .from('contract_types')
      .returning('*');

      console.log('--------------- LOGGING: contractTypes');
      console.log(contractTypes);

      const currencies = await knex.select('*')
      .from('currencies')
      .returning('*');

      console.log('--------------- LOGGING: currencies');
      console.log(currencies);

      const dbPayload = {
        estateTypes: estateTypes.map(estate => ({
          estateTypeId: estate.estate_type_id,
          estateName: strParseOut(estate.estate_name),
        })),
        contractTypes: contractTypes.map(contract => ({
          contractTypeId: contract.contract_type_id,
          contractName: strParseOut(contract.contract_name)
        })),
        currencies: currencies.map(currency => ({
          currencyId: currency.currency_id,
          currencyName: strParseOut(currency.currency_name),
          currencySymbol: currency.currency_symbol,
        }))
      };

      console.log('--------------- LOGGING: dbPayload');
      console.log(dbPayload);

      res.status(200).json(dbPayload)

    } catch (err) {
      throw new Error(err)
    }

  })()

}

module.exports = {
  listingFormDataHandler
}
