const express = require('express');

const knex = require('../../knex/knex-config');
const { httpCheckVerifiedUser } = require('./check-verified.controller');

const checkVerifiedRouter = express.Router();

checkVerifiedRouter.get('/:userid/:estateid/:uploadquantity', httpCheckVerifiedUser(knex));

module.exports = checkVerifiedRouter;
