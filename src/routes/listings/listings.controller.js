const {
  getAllListings,
  getOneListing,
  postListing,
  deleteOneListing,
} = require('../../models/listings.model');

const { ValidationError } = require('../../errors/api-errors');

const { listingValidationSchema } = require('../../joi/listings-validation.schema');

function httpGetAllListings () {
  return async (req, res) => {
    const { knexInstance, params } = req;
    try {
      const listings = await getAllListings(knexInstance, params);
      return res.status(200).json(listings);
    } catch (error) {
      throw new Error(`There is an error, ${error}`);
    }
  }
}

function httpGetOneListing () {
  return async (req, res) => {
    const { knexInstance, params, t } = req;
    const clientLang = req.headers["accept-language"];
    try {
      const listing = await getOneListing(knexInstance, params, t, clientLang);
      return res.status(200).json(listing);
    } catch (error) {
      throw new Error(`There is an error, ${error}`);
    }
  }
}

function httpPostListing () {
  return async (req, res, next) => {
    try {
      const { params, body: listingData, t, knexInstance } = req;
      const clientLang = req.headers["accept-language"];

      const { error } = listingValidationSchema(t, listingData.contractTypeId).validate(listingData, { abortEarly: false });
      if (error) throw new ValidationError('there is an error validating user input', error.details)

      const listing = await postListing(knexInstance, params, listingData, t, clientLang);
      return res.status(200).json(listing);
    } catch (error) {
      if (error instanceof ValidationError) return next(error);
      throw new Error(`There is an error, ${error}`);
    }
  }
}

function httpDeleteOneListing () {
  return async (req, res) => {
    const { params, knexInstance } = req;
    try {
      const deletedListingId = await deleteOneListing(knexInstance, params);
      return res.status(200).json(deletedListingId);
    } catch (error) {
      throw new Error(`There is an error, ${error}`);
    }
  }
}

module.exports = {
  httpGetAllListings,
  httpGetOneListing,
  httpPostListing,
  httpDeleteOneListing
}
