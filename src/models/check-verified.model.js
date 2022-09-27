async function getTotalPicturesNumber (knex, params) {
  const { userid, estateid, uploadquantity } = params;

  const uploadedImagesQuantity = await knex.select('*')
    .from('pictures')
    .where('user_id', '=', userid)
    .andWhere('estate_id', '=', estateid)
    .returning('*')
  
  const totalPictures = uploadedImagesQuantity.length +  Number(uploadquantity);
  return totalPictures;
}

async function checkVerifiedUser (knex, params) {
  const { userid } = params;
    try {
      const verificationCheck = await knex.select('verified')
        .from('users')
        .where('user_id', '=', userid)
        .returning('*')
      
      const isVerified = verificationCheck[0].verified;
      return isVerified;
    } catch  {
      throw new Error(error) 
    }
}

module.exports = {
  getTotalPicturesNumber,
  checkVerifiedUser
}
