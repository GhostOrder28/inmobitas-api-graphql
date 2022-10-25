const { getPictureUrl, getGuestPictureUrl } = require('../utils/cloudinary');
const pdfBuilder = require('../service/pdf-builder');

async function getPresentation (knex, params, t) {
  try {
    const { userid, estateid } = params;
    const contactMessage = {
      bookAnAppointment: t('bookAnAppointment'),
      contactMeAt: t('contactMeAt')
    } 

    const userData = await knex.select('names', 'contact_phone')
      .from('users')
      .where('user_id', '=', userid)
      .returning('*');

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
    console.log('pictures from db: ', listingImages);
    const urls = listingImages.map(img => {
      if (img.auto_generated) {
        return getGuestPictureUrl(img.filename, 'large');
      } else {
        return getPictureUrl(userid, estateid, img.filename, 'large');
      }
    });
    console.log('pictures urls: ', urls);
    const pdfBuffer = await pdfBuilder(urls, userData[0], contactMessage);
  
    return pdfBuffer;

  } catch (error) {
    console.log(error); 
  }

}

module.exports = {
  getPresentation
}
