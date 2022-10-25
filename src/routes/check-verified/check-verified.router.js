const express = require('express');

const { httpCheckVerifiedUser } = require('./check-verified.controller');

const checkVerifiedRouter = express.Router();

checkVerifiedRouter.get('/:userid/:estateid/:uploadquantity', httpCheckVerifiedUser());

module.exports = checkVerifiedRouter;
