const express = require('express');

const knex = require('../../knex/knex-config');
const {
  httpGetAllListings,
  httpGetOneListing,
  httpPostListing,
  httpDeleteOneListing,
} = require('./listings.controller');

const listingsRouter = express.Router();

listingsRouter.get('/:userid', httpGetAllListings(knex));
listingsRouter.get('/:userid/:clientid', httpGetAllListings(knex));
listingsRouter.get('/:userid/:clientid/:estateid', httpGetOneListing(knex));
listingsRouter.get('/:userid/:clientid/:estateid/:group', httpGetOneListing(knex));
listingsRouter.post('/:userid', httpPostListing(knex));
listingsRouter.put('/:userid/:clientid/:estateid/:contractid', httpPostListing(knex));
listingsRouter.delete('/:userid/:listingid', httpDeleteOneListing(knex));

module.exports = listingsRouter;
