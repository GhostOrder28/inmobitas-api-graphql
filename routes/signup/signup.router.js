const express = require('express')

const knex = require('../../knex/knex-config');
const { httpSignup } = require('./signup.controller');

const signupRouter = express.Router();

signupRouter.post('/', httpSignup(knex));

module.exports = signupRouter;
