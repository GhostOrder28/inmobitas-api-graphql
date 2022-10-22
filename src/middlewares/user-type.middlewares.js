const { knexGuest, knexMain } = require('../knex/knex-config');

function checkUserType (req, res, next) {
  console.log('req.user: ', req.user);
  console.log('req.body: ', req.body);

  const userTypeInCookie = req.user?.userType || null;
  const userTypeInBody = req.body.userType || null;
  console.log('checking user type...');

  if (userTypeInCookie === 'guest' || userTypeInBody === 'guest') {
    console.log('user is guest');
    req.knexInstance = knexGuest;  
  } else if (userTypeInCookie === 'normal' || userTypeInBody === 'normal'){
    console.log('user is normal')
    req.knexInstance = knexMain;
  } else {
    throw new Error('user type is neither guest nor normal');
  }
  next();
}

module.exports = {
  checkUserType
}
