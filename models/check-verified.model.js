async function checkVerifiedUser (knex, params) {

const { userid, estateid, uploadquantity } = params;

  try {
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
      return isVerified[0].verified;
    }

  } catch (error) {
    throw new Error(error) 
  }
}

module.exports = {
  checkVerifiedUser
}
