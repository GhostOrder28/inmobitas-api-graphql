const cloudinary = require('cloudinary').v2;
const { Readable } = require('stream');

const uploadPath = 'https://res.cloudinary.com/ghost-order/image/upload';

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

const getPicturesDirPath = (userId, estateId, size) =>
  process.env.NODE_ENV === 'production' ?
    `/inmobitas/u_${userId}/l_${estateId}/pictures/${size}` :
    `/inmobitas_dev/u_${userId}/l_${estateId}/pictures/${size}`;

const getPdfDirPath = (userId, estateId) =>
  process.env.NODE_ENV === 'production' ?
    `/inmobitas/u_${userId}/l_${estateId}` :
    `/inmobitas_dev/u_${userId}/l_${estateId}`

const getPicturePublicId = (userId, estateId, filename, size) =>
  `${getPicturesDirPath(userId, estateId, size).substring(1)}/${filename}_${size}`;

const getPictureUrl = (userId, estateId, filename, size) => 
  `${uploadPath}${getPicturesDirPath(userId, estateId, size)}/${filename}_${size}.webp`

const getDownloadablePdfUrl = (publicId, filename) =>
  `${uploadPath}/${publicId}.pdf`

const cloudinaryUploader = (buffer, filename, directory, mediaType, size) => {
  return new Promise((resolve, reject) => {
    const prom = cloudinary.uploader.upload_stream(
      {
        folder: directory,
        public_id: mediaType === 'img' ? `${filename}_${size}` : filename
      },
      (error, result) => result ? resolve(result) : reject(error)
    );
    bufferToStream(buffer).pipe(prom)
  })
}

const deleteResource = (publicId) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.destroy(
      publicId,
      { resource_type: 'image' },
      (error, result) => result ? resolve(result) : reject(error)
    )
  })
}

module.exports = {
  cloudinary,
  bufferToStream,
  getPicturesDirPath,
  getPdfDirPath,
  getPicturePublicId,
  getPictureUrl,
  getDownloadablePdfUrl,
  cloudinaryUploader,
  deleteResource,
}
