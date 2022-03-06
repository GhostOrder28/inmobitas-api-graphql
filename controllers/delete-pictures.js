const deletePicturesHandler = knex => (req, res) => {

  (async function () {

    try {
      const deletedPicture = await knex('pictures')
      .where('picture_id', '=', req.params.pictureid)
      .del()
      console.log('deletedPicture', req.params.pictureid);
      res.status(200).json(req.params.pictureid)
    } catch (err) {
      throw new Error (`there was an error: ${err}`)
    }

  })()
}

module.exports = {
  deletePicturesHandler
}
