const { getListingPresets } = require('../../models/listing-presets.model');

function httpGetListingPresets (knex) {
  return async (req, res) => {
    const clientLang = req.headers["accept-language"];
    try {
      const listingPresets = await getListingPresets(knex, clientLang);
      console.log(listingPresets);
      return res.status(200).json(listingPresets);
    } catch (error) {
      return res.status(400).json({ error });
    }
  }
}

module.exports = {
  httpGetListingPresets
}
