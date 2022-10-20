const cloudinary = require('cloudinary').v2;

const strParseIn = str => {
  if (str) {
    const parsedStr = str.trim()
      .replaceAll(' ', '-')
      .replaceAll('_', '-')
      .toLowerCase();
    return parsedStr;
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

const capFirst = str => {
  if (str) {
    const string = `${str.charAt(0).toUpperCase()}${str.substring(1)}`;
    return string.replaceAll('-', ' ');
  } else {
    return null;
  }
}

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

function formatDbResponse (obj) {
  const keys = Object.keys(obj);
  const formattedResponse = keys.reduce((acc, currentKey) => {
    const camelCased = currentKey.replace(/\_([a-z])/g, function (g) { return g[1].toUpperCase() })
    return { ...acc, [camelCased]: obj[currentKey] }
  }, {});
  return formattedResponse;
}

module.exports = {
  strParseIn,
  strParseOut,
  capFirst,
  randomNumberGenerator,
  suffixGenerator,
  cloudinaryUnsignedUploader,
  pxToMm,
  formatDbResponse
}
