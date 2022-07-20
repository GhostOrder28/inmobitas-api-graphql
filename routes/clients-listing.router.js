const express = require('express');

const clientsListController = require('../controllers/clients-list.controller');
const knex = require('../knex/knex-config');

const clientsListingRouter = express.Router();

clientsListingRouter.get('/:userid', clientsListController.getClientsList(knex));

module.exports = clientsListingRouter;

