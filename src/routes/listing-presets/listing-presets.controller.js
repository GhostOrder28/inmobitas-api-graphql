const { getListingPresets } = require('../../models/listing-presets.model');

function httpGetListingPresets () {
  return async (req, res) => {
    const { knexInstance } = req;
    const clientLang = req.headers["accept-language"];
    try {
      const listingPresets = await getListingPresets(knexInstance, clientLang);
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
