const express = require('express');

const { httpGetPresentation } = require('./presentations.controller');

const presentationsRouter = express.Router();

presentationsRouter.get('/:userid/:estateid', httpGetPresentation());

module.exports = presentationsRouter;
