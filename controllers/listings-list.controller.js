const { strParseOut } = require('../utils/utility-functions');

const getListingsList = knex => (req, res) => {
  const { userid, clientid } = req.params;

  (async function () {

    try {

      const listingsList = await knex('estates')
      .join('contracts', 'estates.estate_id', 'contracts.estate_id')
      .select('estates.estate_id', 'district', 'neighborhood', 'contracts.estate_price', 'currency_type_id')
      .where('estates.user_id', '=', userid)
        .modify(function (queryBuilder) {
          if (clientid) {
            queryBuilder.andWhere('estates.client_id', '=', clientid);
          }
        })

      console.log('listingsList: ', listingsList);

      const dbPayload = listingsList.map(listing => ({
        estateId: listing.estate_id,
        district: strParseOut(listing.district),
        neighborhood: strParseOut(listing.neighborhood),
      }));

      console.log('dbPayload: ',dbPayload);

      res.status(200).json(dbPayload)

    } catch (err) {
      throw new Error(err)
    }

  })()

}

module.exports = {
  getListingsList
}
