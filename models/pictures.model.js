const sharp = require('sharp');

const { randomNumberGenerator } = require('../utils/utility-functions');
const { 
  cloudinaryUploader, 
  getPicturesDirPath, 
  getPictureUrl, 
  getPicturePublicId, 
  deleteResource 
} = require('../utils/cloudinary');

async function getAllPictures (knex, params) {
  const { userid, estateid } = params;

    try {
      const pictures = await knex.select('picture_id', 'filename')
        .from('pictures')
        .where('estate_id', '=', estateid)
        .returning('*')

      const formattedPictures = pictures.map(pic => ({
        pictureId: pic.picture_id,
        filename: pic.filename,
        smallSizeUrl: getPictureUrl(userid, estateid, pic.filename, 'small'),
        largeSizeUrl: getPictureUrl(userid, estateid, pic.filename, 'large'),
      }))

      console.log('formattedPictures: ', formattedPictures);

      return formattedPictures;
    } catch (err) {
      throw new Error(err)
    }
}

async function postPicture (knex, params, file) {

  const { userid, estateid } = params;
  const { buffer } = file;
  const filename = userid+'_'+estateid+'_'+randomNumberGenerator();

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

      const picture = await knex.insert({
        user_id: userid,
        estate_id: estateid,
        filename,
      })
        .into('pictures')
        .returning('*')

      const formattedPicture = {
        pictureId: picture[0].picture_id,
        filename,
        smallSizeUrl: getPictureUrl(userid, estateid, filename, 'small'),
        largeSizeUrl: getPictureUrl(userid, estateid, filename, 'large'),
      } 

      console.log('formattedPicture: ', formattedPicture);

      return formattedPicture;
    } catch (err) {
      throw new Error(`There is an error, ${err}`)
    }
}

async function deletePicture (knex, params) {
  const { userid, estateid, pictureid } = params;
    
    try {
      const deletedPicture = await knex('pictures')
        .where('picture_id', '=', pictureid)
        .del()
        .returning('*')

      const { filename } = deletedPicture[0];

      await Promise.all([
        deleteResource(getPicturePublicId(userid, estateid, filename, 'small')),
        deleteResource(getPicturePublicId(userid, estateid, filename, 'large')),
      ])
      
      return Number(pictureid);
    } catch (err) {
      throw new Error (`there was an error: ${err}`)
    }
}

module.exports = {
  getAllPictures,
  postPicture,
  deletePicture
}
