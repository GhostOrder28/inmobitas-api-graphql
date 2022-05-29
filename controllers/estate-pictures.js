const { getPictureUrl } = require('../utils/cloudinary');

const estatePicturesHandler = knex => (req, res) => {

  const { userid, estateid } = req.params;
  console.log(`userid ${userid}`, `estateid ${estateid}`);

  (async function () {

    try {

      const pictures = await knex.select('picture_id', 'filename')
      .from('pictures')
      .where('estate_id', '=', estateid)
      .returning('*')

      console.log('pictures: ', pictures);
      
      const payload = pictures.map(pic => ({
        pictureId: pic.picture_id,
        filename: pic.filename,
        smallSizeUrl: getPictureUrl(userid, estateid, pic.filename, 'small'),
        largeSizeUrl: getPictureUrl(userid, estateid, pic.filename, 'large'),
      }))

      console.log('payload: ', payload);

      res.status(200).json(payload)

    } catch (err) {
      throw new Error(err)
    }

  })()

}

module.exports = {
  estatePicturesHandler
}
