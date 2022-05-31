const PDFDocument = require('pdfkit');
const sizeOf = require('buffer-image-size');
const sharp = require('sharp');
const fetch = require('node-fetch');
const getStream = require('get-stream');

const pdfBuilder = async (urls) => {
  
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
  return(pdfBuffer)
}

module.exports = pdfBuilder;
