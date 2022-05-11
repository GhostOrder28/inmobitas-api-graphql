const sharp = require('sharp');
const { cloudinary, bufferToStream, getDirectoryPath, getUrl } = require('../utils/cloudinary');

const uploadFileHandler = knex => (req, res) => {

  const { userid, estateid } = req.params;
  const { buffer } = req.file;
  const filename = userid+'_'+estateid+'_'+Date.now() + '-' + Math.round(Math.random() * 1E9);
  console.log('filename: ', filename);

  const cloudinaryUploader = (buffer, size) => {
    return new Promise((resolve, reject) => {
      const prom = cloudinary.uploader.upload_stream(
        {
          folder: getDirectoryPath(userid, estateid, size),
          public_id: `${filename}_${size}`
        },
        (error, result) => result ? resolve(result) : reject(error)
      );
      bufferToStream(buffer).pipe(prom)
    })
  }

  console.log('file sent by multer: ', req.file);

  (async function () {
    try {

      const smallPicBuffer = await sharp(buffer)
        .toFormat('webp')
        .webp({ quality: 90 })
        .resize({ width: 480 })
        .toBuffer()

      const largePicBuffer = await sharp(buffer)
        .toFormat('webp')
        .webp({ quality: 90 })
        .resize({ width: 1920 })
        .toBuffer()

      const uploadedPictures = await Promise.all([
        cloudinaryUploader(smallPicBuffer, 'small'),
        cloudinaryUploader(largePicBuffer, 'large')
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
        smallSizeUrl: getUrl(userid, estateid, filename, 'small'),
        largeSizeUrl: getUrl(userid, estateid, filename, 'large'),
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
