const sharp = require('sharp');
const { cloudinaryUploader, getPictureUrl, getPicturesDirPath } = require('../utils/cloudinary');
const { randomNumberGenerator } = require('../utils/utility-functions');

const uploadFileHandler = knex => (req, res) => {

  const { userid, estateid } = req.params;
  const { buffer } = req.file;
  const filename = userid+'_'+estateid+'_'+randomNumberGenerator();

  (async function () {
    try {

      const smallPicBuffer = await sharp(buffer)
        .toFormat('webp')
        .webp({ quality: 80 })
        .resize({ width: 480 })
        .toBuffer()

      const largePicBuffer = await sharp(buffer)
        .toFormat('webp')
        .webp({ quality: 80 })
        .resize({ width: 1920 })
        .toBuffer()

      const uploadedPictures = await Promise.all([
        cloudinaryUploader(
          smallPicBuffer,
          filename,
          getPicturesDirPath(userid, estateid, 'small'),
          'img',
          'small'
        ),
        cloudinaryUploader(
          largePicBuffer,
          filename,
          getPicturesDirPath(userid, estateid, 'large'),
          'img',
          'large'
        )
      ])

      console.log('uploadedPictures: ', uploadedPictures);

      const pictureData = await knex.insert({
        user_id: userid,
        estate_id: estateid,
        filename,
      })
      .into('pictures')
      .returning('*')

      console.log('pictureData: ', pictureData);

      const payload = {
        pictureId: pictureData[0].picture_id,
        filename,
        smallSizeUrl: getPictureUrl(userid, estateid, filename, 'small'),
        largeSizeUrl: getPictureUrl(userid, estateid, filename, 'large'),
      } 

      console.log('payload: ', payload);

      res.status(200).json(payload);

    } catch (err) {
      throw new Error(`There is an error, ${err}`)
    }
  })()

}

module.exports = {
  uploadFileHandler
}
