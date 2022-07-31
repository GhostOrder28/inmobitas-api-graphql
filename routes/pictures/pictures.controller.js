const {
  getAllPictures,
  postPicture,
  deletePicture,
} = require('../../models/pictures.model');

function httpGetAllPictures (knex) {
  return async (req, res) => {
    const params = req.params;
    try {
      const pictures = await getAllPictures(knex, params);
      return res.status(200).json(pictures);
    } catch (error) {
      return res.status(400).json({ error });
    }
  }
}

function httpPostPicture (knex) {
  return async (req, res) => {
    const params = req.params;
    const file = req.file;
    try {
      const picture = await postPicture(knex, params, file);
      return res.status(200).json(picture);
    } catch (error) {
      return res.status(400).json({ error });
    }
  }
}

function httpDeletePicture (knex) {
  return async (req, res) => {
    const params = req.params;
    try {
      const deletedPicture = await deletePicture(knex, params);
      return res.status(200).json(deletedPicture);
    } catch (error) {
      return res.status(400).json({ error });
    }
  }
}

module.exports = {
  httpGetAllPictures,
  httpPostPicture,
  httpDeletePicture,
}
