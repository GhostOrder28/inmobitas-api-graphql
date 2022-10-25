const express = require('express');

const { httpGetListingPresets } = require('./listing-presets.controller');

const listingPresetsRouter = express.Router();

listingPresetsRouter.get('/', httpGetListingPresets());

module.exports = listingPresetsRouter;
