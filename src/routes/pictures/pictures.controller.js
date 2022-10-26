const {
  getAllPictures,
  postPicture,
  deletePicture,
} = require('../../models/pictures.model');

function httpGetAllPictures () {
  return async (req, res) => {
    const { params, knexInstance, user: { userType } } = req;
    try {
      const pictures = await getAllPictures(knexInstance, params, userType);
      return res.status(200).json(pictures);
    } catch (error) {
      throw new Error(`There is an error, ${error}`);
    }
  }
}

function httpPostPicture () {
  return async (req, res) => {
    const { params, knexInstance, file, user: { userType } } = req;
    try {
      const picture = await postPicture(knexInstance, params, file, userType);
      return res.status(200).json(picture);
    } catch (error) {
      throw new Error(`There is an error, ${error}`);
    }
  }
}

function httpDeletePicture () {
  return async (req, res) => {
    const { params, knexInstance, user: { userType } } = req;
    try {
      const deletedPicture = await deletePicture(knexInstance, params, userType);
      return res.status(200).json(deletedPicture);
    } catch (error) {
      throw new Error(`There is an error, ${error}`);
    }
  }
}

module.exports = {
  httpGetAllPictures,
  httpPostPicture,
  httpDeletePicture,
}
