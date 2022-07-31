const express = require('express')

const knex = require('../../knex/knex-config');
const { httpSignin } = require('./signin.controller');

const signinRouter = express.Router();

signinRouter.post('/', httpSignin(knex));

module.exports = signinRouter;
