const express = require('express');

const knex = require('../../knex/knex-config');
const {
  httpGetOneClient,
  httpGetAllClients,
  httpUpdateOneClient,
  httpDeleteOneListing,
} = require('./clients.controller');

const clientsRouter = express.Router();

clientsRouter.get('/:userid', httpGetAllClients(knex));
clientsRouter.get('/:userid/:clientid', httpGetOneClient(knex));
clientsRouter.put('/:userid/:clientid', httpUpdateOneClient(knex));
clientsRouter.delete('/:userid/:clientid', httpDeleteOneListing(knex));

module.exports = clientsRouter;
