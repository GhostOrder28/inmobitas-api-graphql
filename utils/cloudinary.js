const cloudinary = require('cloudinary').v2;
const { Readable } = require('stream');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

const bufferToStream = buffer => {
  const readable = new Readable({
    read () {
      this.push(buffer);
      this.push(null);
    }
  });
  return readable;
}

const getDirectoryPath = (userId, estateId, size) =>
  `/inmobitas/u_${userId}/l_${estateId}/pictures/${size}`;

const getPublicId = (userId, estateId, filename, size) =>
  `${getDirectoryPath(userId, estateId, size).substring(1)}/${filename}_${size}`;

const getUrl = (userId, estateId, filename, size) => 
  `${process.env.CLOUDINARY_UPLOAD_URL}${getDirectoryPath(userId, estateId, size)}/${filename}_${size}.webp`

module.exports = {
  cloudinary,
  bufferToStream,
  getDirectoryPath,
  getPublicId,
  getUrl,
}
