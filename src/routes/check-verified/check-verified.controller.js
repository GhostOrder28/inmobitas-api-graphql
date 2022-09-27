const { 
  checkVerifiedUser,
  getTotalPicturesNumber,
} = require('../../models/check-verified.model');
const { UnverifiedUserError } = require('../../errors/db-errors');

function httpCheckVerifiedUser (knex) {
  return async (req, res, next) => {
    const params = req.params;
    try {
      const totalPicturesNumber = await getTotalPicturesNumber(knex, params);
      if (totalPicturesNumber > 6) {
        const isVerified = await checkVerifiedUser(knex, params);
        if (!isVerified) {
          throw new UnverifiedUserError('user is not verified', {
            errorMessage: req.t('uploadLimitExceeded'),
            errorMessageDescription: req.t('uploadLimitExceededReason')
          });
        }
      }
      return res.status(200).json('user is verified');
    } catch (error) {
      if (error instanceof UnverifiedUserError) return next(error);
      throw new Error(`There is an error, ${error}`);
    }
  }
}

module.exports = {
  httpCheckVerifiedUser
}
