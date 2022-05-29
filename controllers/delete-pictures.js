const fsPromises = require('fs-extra').promises;
const { cloudinary, getPicturePublicId } = require('../utils/cloudinary');

const deletePicturesHandler = knex => (req, res) => {

  const { userid, estateid, pictureid } = req.params;

  const deletePicture = (publicId) => {
    return new Promise((resolve, reject) => {
      cloudinary.uploader.destroy(
        publicId,
        { resource_type: 'image' },
        (error, result) => result ? resolve(result) : reject(error)
      )
    })
  }

  (async function () {
    
    try {
      
      const deletedPicture = await knex('pictures')
      .where('picture_id', '=', pictureid)
      .del()
      .returning('*')

      const { filename } = deletedPicture[0];

      await Promise.all([
        deletePicture(getPicturePublicId(userid, estateid, filename, 'small')),
        deletePicture(getPicturePublicId(userid, estateid, filename, 'large')),
      ])

      res.status(200).json(Number(pictureid));
    } catch (err) {
      throw new Error (`there was an error: ${err}`)
    }

  })()
}

module.exports = {
  deletePicturesHandler
}
