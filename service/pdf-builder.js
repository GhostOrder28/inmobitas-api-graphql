const PDFDocument = require('pdfkit');
const sizeOf = require('buffer-image-size');
const sharp = require('sharp');
const fetch = require('node-fetch');
const getStream = require('get-stream');
const { cloudinaryUploader, getPdfDirPath, getPdfUrl } = require('../utils/cloudinary');
const { randomNumberGenerator } = require('../utils/utility-functions');

const pdfBuilder = async (urls, userId, estateId) => {
  
  const pdf = new PDFDocument ({
    size: 'A4',
    autoFirstPage: false,
  });

  for (const url of urls) {
    const res = await fetch(url);
    const body = await res.arrayBuffer();
    const buffer = Buffer.from(body);
    const imgBuffer = await sharp(buffer)
      .toFormat('jpeg')
      .jpeg({ quality: 80 })
      .toBuffer()
    const dimensions = sizeOf(imgBuffer);
    const width = dimensions.width;
    const height = dimensions.height;
    const orientation = width > height ? 'horizontal' : 'vertical';

    const pageMargin = 40;

    pdf
      .addPage({
        layout: orientation === 'horizontal' ? 'landscape' : 'portrait',
        margin: 40
      })
      .image(imgBuffer, {
        fit: [pdf.page.width - pageMargin*2, pdf.page.height - pageMargin*2],
        align: 'center',
        valign: 'center',
      })    
  }

  pdf.end();

  const pdfBuffer = await getStream.buffer(pdf);
  console.log(pdfBuffer);
  const filename = `listing-presentation-${randomNumberGenerator()}`;

  await cloudinaryUploader(pdfBuffer, filename, getPdfDirPath(userId, estateId), 'pdf')
  const cloudUrl = getPdfUrl(userId, estateId, filename)
  console.log('pdf sent to client...');
  return(cloudUrl)
}

module.exports = pdfBuilder;
