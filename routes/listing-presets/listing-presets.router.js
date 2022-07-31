const express = require('express');

const knex = require('../../knex/knex-config');
const { httpGetListingPresets } = require('./listing-presets.controller');

const listingPresetsRouter = express.Router();

listingPresetsRouter.get('/', httpGetListingPresets(knex));

module.exports = listingPresetsRouter;
