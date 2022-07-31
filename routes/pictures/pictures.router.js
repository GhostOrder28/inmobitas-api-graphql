const express = require('express');

const knex = require('../../knex/knex-config');
const {
  httpGetAllPictures,
  httpPostPicture,
  httpDeletePicture,
} = require('./pictures.controller');

const { uploadMiddleware } = require('../../utils/multer-conf');

const clientRouter = express.Router();

clientRouter.get('/:userid/:estateid', httpGetAllPictures(knex));
clientRouter.post('/:userid/:estateid', uploadMiddleware.single('file'), httpPostPicture(knex));
clientRouter.delete('/:userid/:estateid/:pictureid', httpDeletePicture(knex));

module.exports = clientRouter;
