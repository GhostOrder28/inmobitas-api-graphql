const cloudinary = require('cloudinary').v2;

const strParseIn = str => {
  if (str) {
    return str.trim().replaceAll(' ', '-').toLowerCase();
  } else {
    return null
  }
};

const strParseOut = str => {
  if (str) {
    return str.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  } else {
    return null
  }
};

const randomNumberGenerator = () => {
  return Date.now() + '-' + Math.round(Math.random() * 1E9)
};

const suffixGenerator = mimeType => {
  return mimeType.substring(mimeType.lastIndexOf('/')+1);
}

const cloudinaryUnsignedUploader = (image, preset) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.unsigned_upload(
      image, 
      preset,
      { cloud_name: "ghost-order" },
      function(error, result) {
        if (error) return reject(err);
        return resolve(result);
      });
  })
}

const pxToMm = (px, dpi) => ((px * 25.4) / dpi)

module.exports = {
  strParseIn,
  strParseOut,
  randomNumberGenerator,
  suffixGenerator,
  cloudinaryUnsignedUploader,
  pxToMm,
}
