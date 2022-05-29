const fetch = require('node-fetch');
const { jsPDF } = require('jspdf');
const sizeOf = require('buffer-image-size');
const zlib = require('zlib');
const sharp = require('sharp');
const path = require('path');
const { cloudinaryUploader, getPdfDirPath, getPdfUrl } = require('../utils/cloudinary');
const { randomNumberGenerator } = require('../utils/utility-functions');

async function exportPdf(urls, userId, estateId) {

  try {
    let pdf = new jsPDF('p', 'mm', 'a4', true);
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const pageWidthReduced = pdf.internal.pageSize.getWidth() - pdf.internal.pageSize.getWidth() * 0.25;
      const pageHeightReduced = pdf.internal.pageSize.getHeight() - pdf.internal.pageSize.getHeight() * 0.25;
      console.log('pageWidthReduced: ', pageWidthReduced);
      console.log('pageHeightReduced: ', pageHeightReduced);
      let secondImageY = null;
      let thirdImageY = null;
      const pdfPath = path.join(__dirname, '..', '/public', '/listing-presentation.pdf')

    for (let i = 0; i < urls.length; i++) {
      console.log(`CURRENT IMAGE: ${i}`);
      console.log('url: ', urls[i]);
      const response = await fetch(urls[i]);
      const body = await response.arrayBuffer();
      const buffer = Buffer.from(body);
      const optimizedImage = await sharp(buffer)
        .toFormat('jpeg')
        .webp({ quality: 20 })
        .toBuffer()
      const imageBase64  = optimizedImage.toString('base64');
      const dataUrlPrefix = `data:image/webp;base64,`;
      const imageDataUrl = dataUrlPrefix+imageBase64;

      const dimensions = sizeOf(buffer);

      const imgWidth = dimensions.width;
      const imgHeight = dimensions.height;
      const horizontalWhiteSpace = pageWidth - pageWidthReduced;
      const verticalWhiteSpace = pageHeight - pageHeightReduced;

      if (i !== 0 && i % 3 === 0) { pdf.addPage(); }
      //pdf.setPage(i + 1);
      const wc = imgWidth / pageWidthReduced;
      const hc = imgHeight / pageHeightReduced;

      if (i % 3 === 0) {
        console.log(`adding image to the 1st position of the page...`);
        secondImageY = imgHeight / wc + verticalWhiteSpace / 4;
        console.log('secondImageY: ', secondImageY);
        pdf.addImage(imageDataUrl, 'jpeg', horizontalWhiteSpace / 2, verticalWhiteSpace / 4, pageWidthReduced, imgHeight / wc, null, 'FAST');
      } else if ((i-1) % 3 === 0) {            
        console.log(`adding image to the 2nd position of the page...`);
        thirdImageY = imgHeight / wc + secondImageY;
        console.log('thirdImageY: ', thirdImageY);
        pdf.addImage(imageDataUrl, 'jpeg', horizontalWhiteSpace / 2, secondImageY, pageWidthReduced, imgHeight / wc, null, 'FAST');
      } else if ((i-2) % 3 === 0){
        console.log(`adding image to the 3th position of the page...`);
        pdf.addImage(imageDataUrl, 'jpeg', horizontalWhiteSpace / 2, thirdImageY, pageWidthReduced, imgHeight / wc, null, 'FAST');
      }
      //pdf.addImage(imageDataUrl, 'webp', 0, (pageHeightReduced - imgHeight / wc) / 2, pageWidthReduced, imgHeight / wc, null, 'FAST');

      if (i == urls.length - 1) {
        //pdf.save(pdfPath);
        const ab = pdf.output('arraybuffer');

        function toBuffer(ab) {
          var buf = Buffer.alloc(ab.byteLength);
          var view = new Uint8Array(ab);
          for (var i = 0; i < buf.length; ++i) {
              buf[i] = view[i];
          }
          return buf;
        }

        const buffer = toBuffer(ab);
        const filename = `listing-presentation_${randomNumberGenerator()}`;

        await cloudinaryUploader(buffer, filename, getPdfDirPath(userId, estateId), 'pdf')

        const cloudUrl = getPdfUrl(userId, estateId, filename)
        return(cloudUrl)
      }
    }
      
  } catch (error) {
    console.log(error); 
  }

}

module.exports = exportPdf;
