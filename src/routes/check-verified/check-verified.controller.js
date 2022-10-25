const { 
  checkVerifiedUser,
  getTotalPicturesNumber,
} = require('../../models/check-verified.model');
const { UnverifiedUserError } = require('../../errors/db-errors');

function httpCheckVerifiedUser () {
  return async (req, res, next) => {
    const { params, knexInstance, t } = req;
    try {
      const totalPicturesNumber = await getTotalPicturesNumber(knexInstance, params);
      if (totalPicturesNumber > 6) {
        const isVerified = await checkVerifiedUser(knexInstance, params);
        if (!isVerified) {
          throw new UnverifiedUserError('user is not verified', {
            errorMessage: t('uploadLimitExceeded'),
            errorMessageDescription: t('uploadLimitExceededReason')
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
