const { jsPDF } = require('jspdf');
const { getUrl } = require('../utils/cloudinary');
const fetch = require('node-fetch');
const base64Img = require('base64-img');
const { writeFile } = require('fs');
const { Buffer } = require('buffer');
const fs = require('fs');
const sizeOf = require('buffer-image-size');
const sharp = require('sharp');
const exportPdf = require('../utils/jspdf-config');

const fetchImage = async (url) => {
  try {
    const response = await fetch(url);    
    return await response.arrayBuffer();
  } catch (error) {
    console.log(error); 
  }
}

const genPdfHandler = knex => async (req, res) => {
  try {
    const userId = req.params.userid;
    const estateId = req.params.estateid;

    const listingImages = await knex('pictures')
      .where('user_id', '=', userId)
      .andWhere('estate_id', '=', estateId)
      .returning('*')

    const urls = listingImages.map(img => getUrl(userId, estateId, img.filename, 'large'));
    const pdfPath = await exportPdf(urls);
    console.log(`sending file to the client for download: ${pdfPath}`);
    res.download(pdfPath);

  } catch (error) {
    console.log(error); 
  }

}

module.exports = {
  genPdfHandler
}
