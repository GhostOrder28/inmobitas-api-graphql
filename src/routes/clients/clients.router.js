const express = require('express');

const {
  httpGetOneClient,
  httpGetAllClients,
  httpUpdateOneClient,
  httpDeleteOneListing,
} = require('./clients.controller');

const clientsRouter = express.Router();

clientsRouter.get('/:userid', httpGetAllClients());
clientsRouter.get('/:userid/:clientid', httpGetOneClient());
clientsRouter.put('/:userid/:clientid', httpUpdateOneClient());
clientsRouter.delete('/:userid/:clientid', httpDeleteOneListing());

module.exports = clientsRouter;
