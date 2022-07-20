const express = require('express');

const clientController = require('../controllers/client.controller');
const knex = require('../knex/knex-config');

const clientRouter = express.Router();

clientRouter.get('/:userid/:clientid', clientController.getClient(knex));

module.exports = clientRouter;
