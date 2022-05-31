const { getPictureUrl } = require('../utils/cloudinary');
const pdfBuilder = require('../service/pdf-builder');

const genPdfHandler = knex => async (req, res) => {
  try {
    const userId = req.params.userid;
    const estateId = req.params.estateid;

    const listingImages = await knex('pictures')
      .where('user_id', '=', userId)
      .andWhere('estate_id', '=', estateId)
      .returning('*')

    const urls = listingImages.map(img => getPictureUrl(userId, estateId, img.filename, 'large'));
    const pdfPath = await pdfBuilder(urls, userId, estateId);

    res.status(200).json(pdfPath);

  } catch (error) {
    console.log(error); 
  }

}

module.exports = {
  genPdfHandler
}
