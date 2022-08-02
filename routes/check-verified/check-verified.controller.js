const { 
  checkVerifiedUser,
  getTotalPicturesNumber,
} = require('../../models/check-verified.model');

function httpCheckVerifiedUser (knex) {
  return async (req, res) => {
    const params = req.params;
    try {
      const totalPicturesNumber = getTotalPicturesNumber(knex, params);
      if (totalPicturesNumber > 6) {
        const isVerified = await checkVerifiedUser(knex, params);
        if (!isVerified) {
          return res.status(400).json({ notVerifiedMessage1: req.t('notVerifiedMessage1'), notVerifiedMessage2: req.t('notVerifiedMessage2') });
        }
      }
      return res.status(200).json('user is verified');
    } catch (error) {
      return res.status(400).json({ error });
    }
  }
}

module.exports = {
  httpCheckVerifiedUser
}
