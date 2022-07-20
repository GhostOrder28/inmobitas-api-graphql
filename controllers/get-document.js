const { getPictureUrl } = require('../utils/cloudinary');
const pdfBuilder = require('../service/pdf-builder');
//const { randomNumberGenerator } = require('../utils/utility-functions');

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

    /*const estateData = await knex.select('district', 'neighborhood')
      .from('estates')
      .where('user_id', '=', userid)
      .andWhere('estate_id', '=', estateid)
      .returning('*');*/

    //const filename = `${estateData[0].district}${estateData[0].neighborhood !== null ? '-' + estateData[0].neighborhood : ''}_listing-presentation_${randomNumberGenerator()}`;

    const documentsData = await knex.select('*')
      .from('documents')
      .where('user_id', '=', userid)
      .andWhere('estate_id', '=', estateid)
      .returning('*');

    console.log('documentsData: ', documentsData);

    const listingImages = await knex('pictures')
      .where('user_id', '=', userid)
      .andWhere('estate_id', '=', estateid)
      .returning('*');

    const urls = listingImages.map(img => getPictureUrl(userid, estateid, img.filename, 'large'));
    const pdfBuffer = await pdfBuilder(urls, userData[0], contactMessage);

    res.status(200).send(pdfBuffer)

  } catch (error) {
    console.log(error); 
  }

}

module.exports = {
  getDocumentHandler
}
