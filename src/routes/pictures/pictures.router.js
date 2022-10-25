const express = require('express');

const {
  httpGetAllPictures,
  httpPostPicture,
  httpDeletePicture,
} = require('./pictures.controller');

const { uploadMiddleware } = require('../../utils/multer-conf');

const clientRouter = express.Router();

clientRouter.get('/:userid/:estateid', httpGetAllPictures());
clientRouter.post('/:userid/:estateid', uploadMiddleware.single('file'), httpPostPicture());
clientRouter.delete('/:userid/:estateid/:pictureid', httpDeletePicture());

module.exports = clientRouter;
