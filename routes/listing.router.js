const express = require('express');

const listingDataController = require('../controllers/listing-data.controller');
const listingController = require('../controllers/listing.controller');
const knex = require('../knex/knex-config');

const listingRouter = express.Router();

listingRouter.get('/:userid/:estateid', listingDataController.getListing(knex));
listingRouter.post('/:userid', listingController.postListing(knex));
listingRouter.put('/:userid/:clientid/:estateid/:contractid', listingController.postListing(knex));

module.exports = listingRouter;
