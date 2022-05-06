const estatePicturesHandler = knex => (req, res) => {

  const { userid, estateid } = req.params;
  console.log(`userid ${userid}`, `estateid ${estateid}`);

  (async function () {

    try {

      const pictures = await knex.select('picture_id', 'filename', 'suffix')
      .from('pictures')
      .where('estate_id', '=', estateid)
      .returning('*')

      console.log('pictures: ', pictures);

      res.status(200).json(pictures.map(pic => ({
        pictureId: pic.picture_id,
        filename: pic.filename,
        suffix: pic.suffix,
      })))

    } catch (err) {
      throw new Error(err)
    }

  })()

}

module.exports = {
  estatePicturesHandler
}
