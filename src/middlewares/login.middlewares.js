const { AuthorizationError } = require('../errors/api-errors');

async function checkLoggedIn (req, res, next) {
  console.log('is authenticated? ', req.isAuthenticated());
  console.log('is there a user obj? ', req.user);
  try {
    const isLogedIn = req.isAuthenticated() && req.user;
    console.log('is authenticated? ', req.isAuthenticated() && req.user);
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
