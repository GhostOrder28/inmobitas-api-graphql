const {
  getAllListings,
  getOneListing,
  postListing,
} = require('../../models/listings.model');

const { listingValidationSchema } = require('../../joi/listings-validation.schemas');

function httpGetAllListings (knex) {
  return async (req, res) => { 
    const params = req.params;
    try {
      const listings = await getAllListings(knex, params);
      return res.status(200).json(listings);
    } catch (error) {
      return res.status(400).json({ error });
    }
  }
}

function httpGetOneListing (knex) {
  return async (req, res) => {
    const params = req.params; 
    try {
      const listing = await getOneListing(knex, params);
      return res.status(200).json(listing);
    } catch (error) {
      return res.status(400).json({ error }); 
    }
  }
}

function httpPostListing (knex) {
  return async (req, res) => {
    const params = req.params;
    const listingData = req.body;
    const t = req.t;

    const { error } = listingValidationSchema(t, listingData.contractTypeId).validate(req.body, { abortEarly: false })
    if (error) return res.status(400).json({ validationErrors: error.details })

    try {
      const listing = await postListing(knex, params, listingData);
      console.log(listing);
      return res.status(200).json(listing);
    } catch (error) {
      return res.status(400).json({ error });
    }
  }
}

module.exports = {
  httpGetAllListings,
  httpGetOneListing,
  httpPostListing
}
