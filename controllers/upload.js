const { promisify } = require('util');
const fs = require('fs-extra');
const sharp = require('sharp');
const sizeOf = promisify(require('image-size'))
const { TEMP_DIR, USERS_DIR } = require('../utils/constants');

const uploadFileHandler = knex => (req, res) => {
  const { userid, estateid } = req.params;
  const { filename } = req.file;

  console.log('file sent by multer: ', req.file);

  (async function () {
    try {

      // const userData = await knex.select('names')
      // .from('users')
      // .where('user_id', '=', userid)
      // .returning('*')

      const filenameWithOutSuffix = filename.substring(0, filename.indexOf('.') - 1);
      const newSuffix = 'webp';
      const tempPath = `${process.env.ROOT_PATH}/${TEMP_DIR}/${filename}`;
      const sPath = `${process.env.ROOT_PATH}/users/${userid}/pictures/s/${filenameWithOutSuffix}_s.${newSuffix}`;
      const lPath = `${process.env.ROOT_PATH}/users/${userid}/pictures/l/${filenameWithOutSuffix}_l.${newSuffix}`;

      const resizedPictures = await Promise.all([
        await sharp(tempPath)
          .toFormat(newSuffix)
          .webp({ quality: 90 })
          .resize({ width: 480 })
          .toFile(sPath)
          .catch(err => fs.unlinkSync(sPath)),
        await sharp(tempPath)
          .toFormat(newSuffix)
          .webp({ quality: 90 })
          .resize({ width: 1920 })
          .toFile(lPath)
          .catch(err => fs.unlinkSync(lPath)),
      ]);

      console.log('Done!', resizedPictures);

      const pictureData = await knex.insert({
        user_id: userid,
        estate_id: estateid,
        filename: filenameWithOutSuffix,
        suffix: newSuffix,
      })
      .into('pictures')
      .returning('*')

      console.log('pictureData: ', pictureData);

      res.status(200).json({
        pictureId: pictureData[0].picture_id,
        filename: pictureData[0].filename,
        suffix: pictureData[0].suffix,
      });

    } catch (err) {
      throw new Error(`There is an error, ${err}`)
    }
  })()

}

module.exports = {
  uploadFileHandler
}
