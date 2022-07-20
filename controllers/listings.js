const fs = require('fs-extra');
const { strParseOut } = require('../utils/utility-functions');

const listingsHandler = knex => (req, res) => {

  const userId = req.params.userid;

  (async function () {

    try {

      const listingsData = await knex('estates')
      .join('contracts', 'estates.estate_id', 'contracts.estate_id')
      .leftJoin('features', 'estates.estate_id', 'features.estate_id')
      .select('*', 'estates.estate_id')
      .where('estates.user_id', '=', userId)
      .returning('*');

      const dbPayload = listingsData.map(listing => ({
        estateId: listing.estate_id,
        district: listing.district && strParseOut(listing.district),
        neighborhood: listing.neighborhood && strParseOut(listing.neighborhood),
      }))

      console.log('--------------- LOGGING: dbPayload');
      console.log(dbPayload);

      res.status(200).json(dbPayload)
    } catch (err) {
      throw new Error(err)
    }

  })()

}

module.exports = {
  listingsHandler
}
