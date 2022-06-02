const { getPictureUrl } = require('../utils/cloudinary');
const pdfBuilder = require('../service/pdf-builder');
const { cloudinaryUploader, getPdfDirPath, getDownloadablePdfUrl } = require('../utils/cloudinary');
const { randomNumberGenerator } = require('../utils/utility-functions');

const getDocumentHandler = knex => async (req, res) => {
  try {
    const { userid, estateid } = req.params;
    const contactMessage = {
      bookAnAppointment: req.t('bookAnAppointment'),
      contactMeAt: req.t('contactMeAt')
    } 

    const userData = await knex.select('names', 'contact_phone')
      .from('users')
      .where('user_id', '=', userid)
      .returning('*');

    const estateData = await knex.select('district', 'neighborhood')
      .from('estates')
      .where('user_id', '=', userid)
      .andWhere('estate_id', '=', estateid)
      .returning('*');

    const filename = `${estateData[0].district}${estateData[0].neighborhood !== null ? '-' + estateData[0].neighborhood : ''}_listing-presentation_${randomNumberGenerator()}`;

    const documentsData = await knex.select('*')
      .from('documents')
      .where('user_id', '=', userid)
      .andWhere('estate_id', '=', estateid)
      .returning('*');

    console.log('documentsData: ', documentsData);

    if (documentsData[0]?.cloudinary_public_id) {
      res.status(200).json(getDownloadablePdfUrl(documentsData[0].cloudinary_public_id, filename));
    } else {
      const listingImages = await knex('pictures')
        .where('user_id', '=', userid)
        .andWhere('estate_id', '=', estateid)
        .returning('*');

      const urls = listingImages.map(img => getPictureUrl(userid, estateid, img.filename, 'large'));
      const pdfBuffer = await pdfBuilder(urls, userData[0], contactMessage);
      const cloudinaryRes = await cloudinaryUploader(pdfBuffer, filename, getPdfDirPath(userid, estateid), 'pdf')
      
      const documentsData = await knex.insert({
        user_id: userid,
        estate_id: estateid,
        cloudinary_public_id: cloudinaryRes.public_id
      })
        .into('documents')
        .returning('*');

      res.status(200).json(getDownloadablePdfUrl(cloudinaryRes.public_id, filename));
    }
 


  } catch (error) {
    console.log(error); 
  }

}

module.exports = {
  getDocumentHandler
}
