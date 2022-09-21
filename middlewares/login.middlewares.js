const { AuthorizationError } = require('../errors/api-errors');

async function checkLoggedIn (req, res, next) {
  try {
    const isLogedIn = req.isAuthenticated() && req.user;
    if (!isLogedIn) {
      await req.logout();
      throw new AuthorizationError('User is not authorized to get the resource');
    }
    next();
  } catch (error) {
    if (error instanceof AuthorizationError) return next(error);
    throw new Error(error);
  }
}

module.exports = {
  checkLoggedIn
}
