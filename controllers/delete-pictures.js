const fsPromises = require('fs-extra').promises;

const deletePicturesHandler = knex => (req, res) => {

  (async function () {

    try {
      
      const deletedPicture = await knex('pictures')
      .where('picture_id', '=', req.params.pictureid)
      .del()
      .returning('*')
      console.log(deletedPicture);
      console.log('deletedPicture', req.params.pictureid);

      fsPromises.unlink(`${process.env.USERS_PATH}/${req.params.userid}/pictures/l/${deletedPicture[0].filename}_l.${deletedPicture[0].suffix}`)
        .then(() => console.log(`${deletedPicture[0].filename}_l has beend deleted!`))
      fsPromises.unlink(`${process.env.USERS_PATH}/${req.params.userid}/pictures/s/${deletedPicture[0].filename}_s.${deletedPicture[0].suffix}`)
        .then(() => console.log(`${deletedPicture[0].filename}_s has beend deleted!`))

      res.status(200).json(Number(req.params.pictureid))
    } catch (err) {
      throw new Error (`there was an error: ${err}`)
    }

  })()
}

module.exports = {
  deletePicturesHandler
}
