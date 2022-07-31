const express = require('express');

const knex = require('../../knex/knex-config');
const { httpGetPresentation } = require('./presentations.controller');

const presentationsRouter = express.Router();

presentationsRouter.get('/:userid/:estateid', httpGetPresentation(knex));

module.exports = presentationsRouter;
