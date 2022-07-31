const express = require('express');

const knex = require('../../knex/knex-config');
const {
  httpGetOneClient,
  httpGetAllClients,
} = require('./clients.controller');

const clientsRouter = express.Router();

clientsRouter.get('/:userid', httpGetAllClients(knex));
clientsRouter.get('/:userid/:clientid', httpGetOneClient(knex));

module.exports = clientsRouter;
