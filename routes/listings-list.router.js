const express = require('express');

const listingsListController = require('../controllers/listings-list.controller');
const knex = require('../knex/knex-config');

const listingsListRouter = express.Router();

listingsListRouter.get('/:userid', listingsListController.getListingsList(knex));
listingsListRouter.get('/:userid/:clientid', listingsListController.getListingsList(knex));

module.exports = listingsListRouter;
