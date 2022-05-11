const fs = require('fs-extra');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('cloudinary');

const multer = require('multer');
const { TEMP_DIR, USERS_DIR } = require('./constants');
const { randomNumbersGenerator, suffixGenerator } = require('../utils/utility-functions');
 
//const storage = new CloudinaryStorage({
  //cloudinary: cloudinary,
  //params: {
    //folder: 'some-folder-name',
    //format: async (req, file) => 'png', // supports promises as well
    //public_id: (req, file) => 'computed-filename-using-request',
  //},
//});

const storage = multer.memoryStorage();

//const storage = multer.diskStorage({
  //destination: function (req, file, cb) {
    //cb(null, `${process.env.ROOT_PATH}/${TEMP_DIR}`)
  //},
  //filename: function (req, file, cb) {
    //cb(null, `${req.params.userid}_${req.params.estateid}_${randomNumbersGenerator()}.${suffixGenerator(file.mimetype)}`)
  //}
//})

const uploadMiddleware = multer({ storage })

module.exports = {
  uploadMiddleware
}
