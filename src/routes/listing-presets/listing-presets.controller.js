const { getListingPresets } = require('../../models/listing-presets.model');

function httpGetListingPresets (knex) {
  return async (req, res) => {
    const clientLang = req.headers["accept-language"];
    try {
      const listingPresets = await getListingPresets(knex, clientLang);
      console.log(listingPresets);
      return res.status(200).json(listingPresets);
    } catch (error) {
      throw new Error(`There is an error, ${error}`);
    }
  }
}

module.exports = {
  httpGetListingPresets
}
