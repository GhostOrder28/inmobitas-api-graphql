const checkVerifiedUserHanlder = knex => (req, res) => {

  const { userid, estateid, uploadquantity } = req.params;

  (async function () {

    const uploadedImagesQuantity = await knex.select('*')
      .from('pictures')
      .where('user_id', '=', userid)
      .andWhere('estate_id', '=', estateid)
      .returning('*')
    
    console.log('uploadedImagesQuantity: ', uploadedImagesQuantity.length); 

    const totalPictures = uploadedImagesQuantity.length +  Number(uploadquantity);

    if (totalPictures > 6) {
      const isVerified = await knex.select('verified')
        .from('users')
        .where('user_id', '=', userid)
        .returning('*')

      console.log('is user verified? ', isVerified[0].verified)

      if (!isVerified[0].verified) {
        return res.status(400).json({ notVerifiedMessage1: req.t('notVerifiedMessage1'), notVerifiedMessage2: req.t('notVerifiedMessage2') });
      }

    }

    return res.status(200).json('user is verified');

  })();

}

module.exports = {
  checkVerifiedUserHanlder
}
